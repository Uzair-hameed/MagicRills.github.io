// ============================================
// API WORKER - Cloudflare Worker / Vercel Serverless
// TiDB + Grok API Integration
// All Endpoints for Urdu PDF Converter
// ============================================

// ============================================
// TiDB Database Configuration
// ============================================
const TIDB_CONFIG = {
    host: process.env.TIDB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: parseInt(process.env.TIDB_PORT) || 4000,
    user: process.env.TIDB_USERNAME || process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE || 'urdu_converter_db',
    ssl: true
};

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// Tool Slug
const TOOL_SLUG = 'urdu-pdf-converter';

// CORS Headers
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
};

// ============================================
// Database Connection (MySQL/TiDB)
// ============================================
let connection = null;

async function getConnection() {
    if (connection) return connection;
    
    try {
        const mysql = require('mysql2/promise');
        connection = await mysql.createConnection({
            host: TIDB_CONFIG.host,
            port: TIDB_CONFIG.port,
            user: TIDB_CONFIG.user,
            password: TIDB_CONFIG.password,
            database: TIDB_CONFIG.database,
            ssl: TIDB_CONFIG.ssl ? { rejectUnauthorized: true } : null,
            connectTimeout: 30000,
            enableKeepAlive: true
        });
        
        await ensureTables();
        return connection;
    } catch (error) {
        console.error('TiDB Connection Error:', error);
        return null;
    }
}

// ============================================
// Ensure Tables Exist
// ============================================
async function ensureTables() {
    if (!connection) return;
    
    try {
        // Usage table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_usage (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                user_id VARCHAR(100),
                count INT DEFAULT 1,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uk_tool_user (tool_slug, user_id),
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        // Reactions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_reactions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                emoji VARCHAR(20) NOT NULL,
                reaction_type VARCHAR(50),
                user_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uk_tool_user_emoji (tool_slug, user_id, emoji),
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        // Shares table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_shares (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                platform VARCHAR(50),
                user_id VARCHAR(100),
                shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        // AI Cache table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ai_cache (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                cache_key VARCHAR(500) NOT NULL UNIQUE,
                tool_slug VARCHAR(100),
                prompt_type VARCHAR(50),
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                INDEX idx_cache_key (cache_key)
            )
        `);
        
        console.log('Tables verified/created');
    } catch (error) {
        console.error('Table creation error:', error);
    }
}

// ============================================
// Helper Functions
// ============================================
function sendJSON(status, data) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: CORS_HEADERS
    });
}

// ============================================
// API Handlers
// ============================================

// GET /api/health - Health check
async function handleHealth() {
    return sendJSON(200, {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        tool: TOOL_SLUG,
        version: '3.0',
        database: connection ? 'connected' : 'disconnected'
    });
}

// GET /api/usage - Get usage count
async function handleGetUsage(url) {
    const toolSlug = url.searchParams.get('tool_slug') || TOOL_SLUG;
    let count = 0;
    
    const conn = await getConnection();
    if (conn) {
        const [rows] = await conn.execute(
            'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
            [toolSlug]
        );
        count = rows[0]?.total || 0;
    }
    
    return sendJSON(200, { success: true, tool_slug: toolSlug, count });
}

// POST /api/increment-usage - Increment usage counter
async function handleIncrementUsage(request) {
    const body = await request.json();
    const toolSlug = body.tool_slug || TOOL_SLUG;
    const userId = body.user_id || 'anonymous';
    
    let totalUsage = 0;
    const conn = await getConnection();
    
    if (conn) {
        await conn.execute(
            `INSERT INTO tool_usage (tool_slug, user_id, count, last_used)
             VALUES (?, ?, 1, NOW())
             ON DUPLICATE KEY UPDATE count = count + 1, last_used = NOW()`,
            [toolSlug, userId]
        );
        
        const [rows] = await conn.execute(
            'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
            [toolSlug]
        );
        totalUsage = rows[0]?.total || 0;
    }
    
    return sendJSON(200, {
        success: true,
        tool_slug: toolSlug,
        total_usage: totalUsage,
        user_id: userId
    });
}

// GET /api/reactions - Get all reactions
async function handleGetReactions(url) {
    const toolSlug = url.searchParams.get('tool_slug') || TOOL_SLUG;
    const reactions = {
        like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
    };
    
    const conn = await getConnection();
    if (conn) {
        const [rows] = await conn.execute(
            `SELECT reaction_type, COUNT(*) as count
             FROM tool_reactions
             WHERE tool_slug = ?
             GROUP BY reaction_type`,
            [toolSlug]
        );
        
        rows.forEach(row => {
            if (reactions.hasOwnProperty(row.reaction_type)) {
                reactions[row.reaction_type] = row.count;
            }
        });
    }
    
    return sendJSON(200, {
        success: true,
        tool_slug: toolSlug,
        reactions: reactions
    });
}

// POST /api/add-reaction - Add a reaction
async function handleAddReaction(request) {
    const body = await request.json();
    const toolSlug = body.tool_slug || TOOL_SLUG;
    const emoji = body.emoji;
    const reactionType = body.reaction_type;
    const userId = body.user_id || 'anonymous';
    
    if (!emoji || !reactionType) {
        return sendJSON(400, { success: false, error: 'emoji and reaction_type required' });
    }
    
    let alreadyReacted = false;
    const conn = await getConnection();
    
    if (conn) {
        try {
            await conn.execute(
                `INSERT INTO tool_reactions (tool_slug, emoji, reaction_type, user_id)
                 VALUES (?, ?, ?, ?)`,
                [toolSlug, emoji, reactionType, userId]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                alreadyReacted = true;
            }
        }
    }
    
    // Get updated counts
    const reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
    if (conn && !alreadyReacted) {
        const [rows] = await conn.execute(
            `SELECT reaction_type, COUNT(*) as count
             FROM tool_reactions
             WHERE tool_slug = ?
             GROUP BY reaction_type`,
            [toolSlug]
        );
        rows.forEach(row => {
            if (reactions.hasOwnProperty(row.reaction_type)) {
                reactions[row.reaction_type] = row.count;
            }
        });
    }
    
    if (alreadyReacted) {
        return sendJSON(200, {
            success: false,
            already_reacted: true,
            message: 'You have already reacted with this emoji',
            counts: reactions
        });
    }
    
    return sendJSON(200, {
        success: true,
        message: 'Reaction added',
        tool_slug: toolSlug,
        reaction_type: reactionType,
        counts: reactions
    });
}

// GET /api/shares - Get share count
async function handleGetShares(url) {
    const toolSlug = url.searchParams.get('tool_slug') || TOOL_SLUG;
    let count = 0;
    
    const conn = await getConnection();
    if (conn) {
        const [rows] = await conn.execute(
            'SELECT COUNT(*) as total FROM tool_shares WHERE tool_slug = ?',
            [toolSlug]
        );
        count = rows[0]?.total || 0;
    }
    
    return sendJSON(200, {
        success: true,
        tool_slug: toolSlug,
        count: count
    });
}

// POST /api/add-share - Add a share
async function handleAddShare(request) {
    const body = await request.json();
    const toolSlug = body.tool_slug || TOOL_SLUG;
    const platform = body.platform || 'unknown';
    const userId = body.user_id || 'anonymous';
    
    const conn = await getConnection();
    if (conn) {
        await conn.execute(
            `INSERT INTO tool_shares (tool_slug, platform, user_id)
             VALUES (?, ?, ?)`,
            [toolSlug, platform, userId]
        );
    }
    
    return sendJSON(200, {
        success: true,
        message: 'Share recorded',
        tool_slug: toolSlug,
        platform: platform
    });
}

// GET /api/stats - Get all stats
async function handleGetStats(url) {
    const toolSlug = url.searchParams.get('tool_slug') || TOOL_SLUG;
    let stats = {
        totalUsage: 0,
        totalShares: 0,
        totalReactions: 0,
        uniqueUsers: 0,
        reactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 }
    };
    
    const conn = await getConnection();
    if (conn) {
        // Usage
        const [usageRows] = await conn.execute(
            'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
            [toolSlug]
        );
        stats.totalUsage = usageRows[0]?.total || 0;
        
        // Shares
        const [shareRows] = await conn.execute(
            'SELECT COUNT(*) as total FROM tool_shares WHERE tool_slug = ?',
            [toolSlug]
        );
        stats.totalShares = shareRows[0]?.total || 0;
        
        // Reactions
        const [reactionRows] = await conn.execute(
            `SELECT reaction_type, COUNT(*) as count
             FROM tool_reactions
             WHERE tool_slug = ?
             GROUP BY reaction_type`,
            [toolSlug]
        );
        reactionRows.forEach(row => {
            if (stats.reactions.hasOwnProperty(row.reaction_type)) {
                stats.reactions[row.reaction_type] = row.count;
            }
        });
        stats.totalReactions = Object.values(stats.reactions).reduce((a, b) => a + b, 0);
        
        // Unique users
        const [userRows] = await conn.execute(
            'SELECT COUNT(DISTINCT user_id) as total FROM tool_usage WHERE tool_slug = ?',
            [toolSlug]
        );
        stats.uniqueUsers = userRows[0]?.total || 0;
    }
    
    return sendJSON(200, {
        success: true,
        tool_slug: toolSlug,
        stats: stats
    });
}

// POST /api/repair-urdu-text - Grok API text repair
async function handleRepairUrduText(request) {
    const body = await request.json();
    const text = body.text;
    const toolSlug = body.tool_slug || TOOL_SLUG;
    
    if (!text) {
        return sendJSON(400, { success: false, error: 'Text required' });
    }
    
    // Check cache first
    const cacheKey = `urdu_repair_${Buffer.from(text.substring(0, 100)).toString('base64')}`;
    const conn = await getConnection();
    
    if (conn) {
        try {
            const [cached] = await conn.execute(
                'SELECT response FROM ai_cache WHERE cache_key = ? AND expires_at > NOW()',
                [cacheKey]
            );
            if (cached.length > 0) {
                return sendJSON(200, {
                    success: true,
                    repaired_text: cached[0].response,
                    source: 'cache'
                });
            }
        } catch(e) {}
    }
    
    // Call Grok API
    if (!GROK_API_KEY) {
        // Fallback: simple rule-based repair
        const repaired = simpleUrduRepair(text);
        return sendJSON(200, {
            success: true,
            repaired_text: repaired,
            source: 'fallback'
        });
    }
    
    try {
        const prompt = `آپ ایک اردو متن بحال کرنے والے ماہر ہیں۔ نیچے دیا گیا متن PDF سے نکالا گیا ہے جس میں تمام خالی جگہیں (spaces) غائب ہو چکی ہیں۔

متن:
"${text.substring(0, 6000)}"

براہ کرم درج ذیل اصولوں کے مطابق متن کو درست کریں:
1. ہر لفظ کے بعد مناسب جگہ لگائیں
2. جملے کے آخر میں (۔!؟) کے بعد نیا لائن دیں
3. تاریخوں، اعداد، اور انگریزی حروف کو ویسے ہی رکھیں
4. سرکاری خطوط میں underline (_____) کو محفوظ رکھیں
5. کالون (:) اور سیمی کالون (؛) کے بعد جگہ لگائیں

صرف درست شدہ اردو متن واپس کریں، بغیر کسی اضافی وضاحت کے۔`;

        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-1',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
                max_tokens: 8000
            })
        });
        
        const data = await response.json();
        const repairedText = data.choices?.[0]?.message?.content || text;
        
        // Cache the result
        if (conn && repairedText !== text) {
            try {
                await conn.execute(
                    `INSERT INTO ai_cache (cache_key, tool_slug, prompt_type, response, expires_at)
                     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
                     ON DUPLICATE KEY UPDATE response = VALUES(response), expires_at = VALUES(expires_at)`,
                    [cacheKey, toolSlug, 'urdu_repair', repairedText]
                );
            } catch(e) {}
        }
        
        return sendJSON(200, {
            success: true,
            repaired_text: repairedText,
            source: 'grok_api'
        });
        
    } catch (error) {
        console.error('Grok API error:', error);
        const repaired = simpleUrduRepair(text);
        return sendJSON(200, {
            success: true,
            repaired_text: repaired,
            source: 'fallback',
            error: error.message
        });
    }
}

// Simple Urdu text repair (fallback when API is unavailable)
function simpleUrduRepair(text) {
    if (!text) return '';
    
    let fixed = text;
    
    // Add space after sentence terminators
    fixed = fixed.replace(/([۔؟!])([^\s])/g, '$1 $2');
    
    // Fix common Urdu patterns
    fixed = fixed.replace(/([کگھدذرزژسشصضطظعغفقلمنویہھی])([آابپتٹثجچحخ])/g, '$1 $2');
    
    // Add space after numbers
    fixed = fixed.replace(/([۰-۹0-9])([آابپتٹثجچحخ])/g, '$1 $2');
    
    // Fix missing spaces after common short words
    const shortWords = ['کہ', 'سے', 'پر', 'میں', 'نے', 'تو', 'یا', 'تا', 'کیا', 'ہی', 'بھی', 'اور', 'پھر', 'اگر', 'لیکن'];
    shortWords.forEach(word => {
        const regex = new RegExp(`(${word})([آابپتٹثجچحخدرڑزژسشصضطظعغفقلمنویھ])`, 'g');
        fixed = fixed.replace(regex, `$1 $2`);
    });
    
    // Fix multiple spaces
    fixed = fixed.replace(/\s+/g, ' ');
    
    // Add new line after sentence
    fixed = fixed.replace(/([۔؟!])\s+/g, '$1\n');
    
    return fixed;
}

// POST /api/ai-feature - AI features (summarize, translate, grammar, enhance)
async function handleAIFeature(request) {
    const body = await request.json();
    const feature = body.feature;
    const text = body.text;
    const toolSlug = body.tool_slug || TOOL_SLUG;
    
    if (!text) {
        return sendJSON(400, { success: false, error: 'Text required' });
    }
    
    if (!GROK_API_KEY) {
        // Return simple fallback responses
        let fallbackResult = '';
        switch(feature) {
            case 'summarize':
                const sentences = text.split(/[۔!?]/);
                fallbackResult = sentences.slice(0, Math.ceil(sentences.length / 3)).join('۔') + '۔';
                break;
            case 'enhance':
                fallbackResult = simpleUrduRepair(text);
                break;
            default:
                fallbackResult = `${feature} کی سہولت کے لیے API کلید درکار ہے۔`;
        }
        return sendJSON(200, {
            success: true,
            result: fallbackResult,
            source: 'fallback'
        });
    }
    
    try {
        let prompt = '';
        switch(feature) {
            case 'summarize':
                prompt = `براہ کرم درج ذیل اردو متن کا مختصر خلاصہ بنائیں (3-4 جملوں میں):\n\n${text.substring(0, 4000)}`;
                break;
            case 'translate':
                prompt = `براہ کرم درج ذیل اردو متن کا انگریزی میں ترجمہ کریں:\n\n${text.substring(0, 3000)}`;
                break;
            case 'grammar':
                prompt = `براہ کرم درج ذیل اردو متن میں گرامر کی غلطیاں چیک کریں اور درست کریں:\n\n${text.substring(0, 4000)}`;
                break;
            case 'enhance':
                prompt = `براہ کرم درج ذیل اردو متن کو بہتر بنائیں، الفاظ کے درمیان مناسب جگہیں لگائیں، اور جملوں کو درست کریں:\n\n${text.substring(0, 4000)}`;
                break;
            default:
                prompt = text;
        }
        
        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-1',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 4000
            })
        });
        
        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || text;
        
        return sendJSON(200, {
            success: true,
            result: result,
            source: 'grok_api'
        });
        
    } catch (error) {
        console.error('AI feature error:', error);
        return sendJSON(200, {
            success: true,
            result: simpleUrduRepair(text),
            source: 'fallback',
            error: error.message
        });
    }
}

// ============================================
// Main Handler (Cloudflare Worker / Vercel)
// ============================================
async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // CORS Preflight
    if (method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }
    
    // Route handlers
    if (method === 'GET' && path === '/api/health') {
        return handleHealth();
    }
    
    if (method === 'GET' && path === '/api/usage') {
        return handleGetUsage(url);
    }
    
    if (method === 'POST' && path === '/api/increment-usage') {
        return handleIncrementUsage(request);
    }
    
    if (method === 'GET' && path === '/api/reactions') {
        return handleGetReactions(url);
    }
    
    if (method === 'POST' && path === '/api/add-reaction') {
        return handleAddReaction(request);
    }
    
    if (method === 'GET' && path === '/api/shares') {
        return handleGetShares(url);
    }
    
    if (method === 'POST' && path === '/api/add-share') {
        return handleAddShare(request);
    }
    
    if (method === 'GET' && path === '/api/stats') {
        return handleGetStats(url);
    }
    
    if (method === 'POST' && path === '/api/repair-urdu-text') {
        return handleRepairUrduText(request);
    }
    
    if (method === 'POST' && path === '/api/ai-feature') {
        return handleAIFeature(request);
    }
    
    // 404 Not Found
    return sendJSON(404, {
        success: false,
        error: 'Endpoint not found',
        available_endpoints: [
            'GET  /api/health',
            'GET  /api/usage',
            'POST /api/increment-usage',
            'GET  /api/reactions',
            'POST /api/add-reaction',
            'GET  /api/shares',
            'POST /api/add-share',
            'GET  /api/stats',
            'POST /api/repair-urdu-text',
            'POST /api/ai-feature'
        ]
    });
}

// ============================================
// Export for Cloudflare Workers
// ============================================
export default {
    async fetch(request, env, ctx) {
        // Set environment variables from Cloudflare Workers env
        if (env.TIDB_HOST) process.env.TIDB_HOST = env.TIDB_HOST;
        if (env.TIDB_USERNAME) process.env.TIDB_USERNAME = env.TIDB_USERNAME;
        if (env.TIDB_PASSWORD) process.env.TIDB_PASSWORD = env.TIDB_PASSWORD;
        if (env.TIDB_DATABASE) process.env.TIDB_DATABASE = env.TIDB_DATABASE;
        if (env.GROK_API_KEY) process.env.GROK_API_KEY = env.GROK_API_KEY;
        
        return handleRequest(request);
    }
};

// ============================================
// Export for Vercel Serverless
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = async (req, res) => {
        const response = await handleRequest(req);
        const data = await response.json();
        res.status(response.status).json(data);
    };
}
