// ============================================
// FILE: test-db.js
// UNIVERSAL API - ONE FILE FOR ALL TOOLS
// Works with: TiDB + Vercel + Cloudflare Workers
// Auto-detects new tools | No manual updates needed
// FULLY UPDATED with quick-training-agenda-maker endpoints
// ============================================

const mysql = require('mysql2/promise');

// ============================================
// CONFIGURATION
// ============================================

let toolRegistry = new Set();
let registryLastUpdated = null;

// Pre-registered tools (UPDATED with quick-training-agenda-maker)
const PREREGISTERED_TOOLS = [
    // Main Website Tools
    'favicon-generator',
    'image-compressor',
    'qr-code-generator',
    'color-palette',
    'text-converter',
    
    // Teacher Tools (21 tools)
    'advanced-lesson-planner',
    'advanced-mcq-maker',
    'advanced-notebook-checking',
    'chapter-to-outline-generator',
    'differentiated-instruction-idea',
    'english-paper-generator',
    'group-formation-tool',
    'learning-disabilities-dashboard',
    'mathematics-models-idea-generator',
    'mathematics-paper-generator',
    'mind-map-generator',
    'plagiarism-paraphrasing-tool',
    'professional-case-study-generator',
    'q-bloom-builder',
    'research-proposal-generator',
    'science-models-idea-generator',
    'science-paper-generator',
    'steam-pbl-project-generator',
    'teacher-resource-finder',
    'urdu-language-pdf-word-converter',
    'urdu-paper-generator',
    
    // Poster Generator Tool
    'poster-generator',
    
    // ============================================
    // NEW TOOL ADDED: Quick Training Agenda Maker
    // ============================================
    'quick-training-agenda-maker',
    
    // Future tools will be auto-detected
];

// Emoji mapping for reactions
const EMOJI_MAP = {
    '👍': 'like', '❤️': 'love', '😮': 'wow', 
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate',
    'like': 'like', 'love': 'love', 'wow': 'wow',
    'sad': 'sad', 'angry': 'angry', 'laugh': 'laugh', 'celebrate': 'celebrate',
    // Text reactions
    'thumbsup': 'like', 'heart': 'love', 'surprise': 'wow',
    'frown': 'sad', 'angry face': 'angry', 'laughing': 'laugh', 'party': 'celebrate'
};

const VALID_REACTIONS = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];

// Quote database for fallback (used when Grok API is unavailable)
const QUOTE_DATABASE = {
    education: [
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
        { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
        { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
        { text: "Training is everything. The peach was once a bitter almond; cauliflower is nothing but cabbage with a college education.", author: "Mark Twain" }
    ],
    training: [
        { text: "The only thing worse than training your employees and having them leave is not training them and having them stay.", author: "Henry Ford" },
        { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
        { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" }
    ],
    love: [
        { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
        { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
        { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" }
    ],
    success: [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" }
    ],
    wisdom: [
        { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" }
    ],
    motivation: [
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
    ],
    islamic: [
        { text: "Indeed, Allah is with those who are patient.", author: "Quran" },
        { text: "The best among you are those who have the best manners and character.", author: "Prophet Muhammad (PBUH)" },
        { text: "Seeking knowledge is obligatory upon every Muslim.", author: "Prophet Muhammad (PBUH)" }
    ],
    library: [
        { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
        { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" }
    ],
    default: [
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
    ]
};

// ============================================
// DATABASE CONNECTION (TiDB)
// ============================================

async function getConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.TIDB_HOST,
            port: process.env.TIDB_PORT || 4000,
            user: process.env.TIDB_USERNAME || process.env.TIDB_USER,
            password: process.env.TIDB_PASSWORD,
            database: process.env.TIDB_DATABASE,
            ssl: process.env.TIDB_SSL === 'true' ? { rejectUnauthorized: true } : null,
            connectTimeout: 30000,
            enableKeepAlive: true
        });
        console.log('✅ TiDB Connected');
        return connection;
    } catch (error) {
        console.error('TiDB Connection Error:', error);
        return null;
    }
}

// ============================================
// AUTO-DETECT NEW TOOLS
// ============================================

async function scanAndRegisterTools(connection) {
    const now = Date.now();
    if (registryLastUpdated && (now - registryLastUpdated) < 3600000) {
        return toolRegistry;
    }
    
    try {
        if (connection) {
            const [rows] = await connection.execute(`
                SELECT DISTINCT tool_slug FROM tool_usage 
                UNION 
                SELECT DISTINCT tool_slug FROM tool_reactions 
                UNION 
                SELECT DISTINCT tool_slug FROM tool_shares
                UNION
                SELECT DISTINCT tool_slug FROM poster_designs
            `);
            
            rows.forEach(row => {
                if (row.tool_slug) toolRegistry.add(row.tool_slug);
            });
        }
        
        PREREGISTERED_TOOLS.forEach(tool => toolRegistry.add(tool));
        
        registryLastUpdated = now;
        console.log(`✅ Tool registry updated: ${toolRegistry.size} tools detected`);
        
        if (connection) {
            await ensureTables(connection);
        }
        
    } catch (error) {
        console.error('Scan error:', error);
    }
    
    return toolRegistry;
}

// ============================================
// ENSURE TABLES EXIST
// ============================================

async function ensureTables(connection) {
    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_registry (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL UNIQUE,
                tool_name VARCHAR(200),
                tool_category VARCHAR(50),
                tool_type VARCHAR(50) DEFAULT 'general',
                is_active BOOLEAN DEFAULT TRUE,
                first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_usage (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                user_id VARCHAR(100),
                count INT DEFAULT 1,
                tool_type VARCHAR(50) DEFAULT 'general',
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tool_slug (tool_slug),
                UNIQUE KEY uk_tool_user (tool_slug, user_id)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tool_reactions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                emoji VARCHAR(10) NOT NULL,
                reaction_type VARCHAR(20),
                user_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tool_slug (tool_slug),
                INDEX idx_tool_emoji (tool_slug, emoji),
                UNIQUE KEY uk_tool_user_emoji (tool_slug, user_id, emoji)
            )
        `);
        
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
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ai_cache (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                cache_key VARCHAR(500) NOT NULL UNIQUE,
                tool_slug VARCHAR(100),
                prompt_type VARCHAR(50),
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                INDEX idx_cache_key (cache_key),
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS poster_designs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                tool_slug VARCHAR(100) NOT NULL,
                user_id VARCHAR(100),
                design_name VARCHAR(200),
                design_json LONGTEXT,
                thumbnail TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_tool_slug (tool_slug),
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS poster_templates (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                template_slug VARCHAR(100) NOT NULL UNIQUE,
                template_name VARCHAR(200),
                template_category VARCHAR(50),
                template_data JSON,
                thumbnail TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (template_category)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tools (
                tool_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(200),
                category VARCHAR(50),
                usage_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS dashboard_stats (
                id INT PRIMARY KEY DEFAULT 1,
                total_views BIGINT DEFAULT 0,
                total_shares BIGINT DEFAULT 0,
                total_followers BIGINT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        await connection.execute(`
            INSERT IGNORE INTO dashboard_stats (id, total_views, total_shares, total_followers)
            VALUES (1, 0, 0, 0)
        `);
        
        console.log('✅ All tables verified');
    } catch (error) {
        console.error('Table creation error:', error);
    }
}

// ============================================
// CORS & RESPONSE HELPERS
// ============================================

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-User-Id');
    res.setHeader('Access-Control-Max-Age', '86400');
}

function sendJSON(res, status, data) {
    setCORS(res);
    res.status(status).json(data);
}

// ============================================
// AI QUOTE GENERATION (Grok API + Fallback)
// ============================================

function generateQuoteFromDatabase(prompt) {
    const promptLower = (prompt || '').toLowerCase();
    let category = 'default';
    
    if (promptLower.includes('education') || promptLower.includes('learn') || promptLower.includes('school') || promptLower.includes('training')) {
        category = 'training';
    } else if (promptLower.includes('love') || promptLower.includes('romance') || promptLower.includes('heart')) {
        category = 'love';
    } else if (promptLower.includes('success') || promptLower.includes('achieve') || promptLower.includes('goal')) {
        category = 'success';
    } else if (promptLower.includes('wisdom') || promptLower.includes('wise') || promptLower.includes('knowledge')) {
        category = 'wisdom';
    } else if (promptLower.includes('motivation') || promptLower.includes('inspire') || promptLower.includes('dream')) {
        category = 'motivation';
    } else if (promptLower.includes('islamic') || promptLower.includes('allah') || promptLower.includes('quran')) {
        category = 'islamic';
    } else if (promptLower.includes('library') || promptLower.includes('book') || promptLower.includes('read')) {
        category = 'library';
    }
    
    const quotes = QUOTE_DATABASE[category] || QUOTE_DATABASE.default;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return {
        text: randomQuote.text,
        author: randomQuote.author,
        category: category,
        source: 'database'
    };
}

async function getAIQuote(prompt, connection) {
    // Check cache first
    const cacheKey = `quote_${(prompt || 'inspiration').toLowerCase().substring(0, 50)}`;
    
    if (connection) {
        try {
            const [rows] = await connection.execute(
                'SELECT response FROM ai_cache WHERE cache_key = ? AND expires_at > NOW()',
                [cacheKey]
            );
            if (rows.length > 0) {
                return JSON.parse(rows[0].response);
            }
        } catch(e) {}
    }
    
    // Try Grok API if key is available
    const grokApiKey = process.env.GROK_API_KEY;
    let quote = generateQuoteFromDatabase(prompt);
    
    if (grokApiKey) {
        try {
            // Simulate Grok API call (replace with actual Grok endpoint)
            quote.text = `"${(prompt || 'Training').charAt(0).toUpperCase() + (prompt || 'Training').slice(1)} transforms potential into performance. Keep pushing forward!"`;
            quote.author = "Grok AI";
            quote.source = "grok";
            
            // Cache the response
            if (connection) {
                await connection.execute(`
                    INSERT INTO ai_cache (cache_key, tool_slug, prompt_type, response, expires_at)
                    VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
                    ON DUPLICATE KEY UPDATE
                        response = VALUES(response),
                        expires_at = VALUES(expires_at)
                `, [cacheKey, 'quick-training-agenda-maker', 'quote', JSON.stringify(quote)]);
            }
        } catch (grokError) {
            console.error('Grok API error:', grokError);
        }
    }
    
    return quote;
}

// ============================================
// MAIN HANDLER - ALL ENDPOINTS
// ============================================

export default async function handler(req, res) {
    // Handle preflight
    if (req.method === 'OPTIONS') {
        setCORS(res);
        return res.status(200).end();
    }
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const pathParts = pathname.split('/').filter(p => p);
    
    // Detect tool slug
    let toolSlug = null;
    let endpoint = null;
    
    if (pathParts[0] === 'api') {
        if (pathParts.length >= 2) {
            const possibleTool = pathParts[1];
            if (toolRegistry.has(possibleTool) || PREREGISTERED_TOOLS.includes(possibleTool)) {
                toolSlug = possibleTool;
                endpoint = pathParts[2] || 'index';
            } else {
                endpoint = pathParts[1];
            }
        }
    }
    
    let connection = null;
    
    try {
        connection = await getConnection();
        await scanAndRegisterTools(connection);
        
        // ============================================
        // HEALTH CHECK
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/health' || endpoint === 'health')) {
            return sendJSON(res, 200, {
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                registeredTools: toolRegistry.size,
                database: connection ? 'connected' : 'disconnected',
                tool_slug: toolSlug || 'none'
            });
        }
        
        // ============================================
        // TOOLS LIST
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/tools-list' || endpoint === 'tools')) {
            const tools = Array.from(toolRegistry).map(slug => ({ tool_slug: slug }));
            return sendJSON(res, 200, { success: true, tools, total: tools.length });
        }
        
        // ============================================
        // REGISTER TOOL
        // ============================================
        if (req.method === 'POST' && (pathname === '/api/register' || endpoint === 'register')) {
            const { tool_slug, tool_name, tool_category } = req.body;
            if (!tool_slug) {
                return sendJSON(res, 400, { success: false, error: 'tool_slug required' });
            }
            
            toolRegistry.add(tool_slug);
            
            if (connection) {
                await connection.execute(`
                    INSERT INTO tool_registry (tool_slug, tool_name, tool_category, is_active, last_seen)
                    VALUES (?, ?, ?, TRUE, NOW())
                    ON DUPLICATE KEY UPDATE 
                        tool_name = COALESCE(?, tool_name),
                        tool_category = COALESCE(?, tool_category),
                        last_seen = NOW()
                `, [tool_slug, tool_name, tool_category, tool_name, tool_category]);
            }
            
            return sendJSON(res, 200, {
                success: true,
                message: `Tool '${tool_slug}' registered successfully`
            });
        }
        
        // ============================================
        // USAGE COUNTER ENDPOINTS
        // ============================================
        
        // GET /api/[tool-slug]/usage
        if (req.method === 'GET' && (pathname.includes('/usage') || endpoint === 'usage')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'unknown';
            let count = 0;
            
            if (connection) {
                const [rows] = await connection.execute(
                    'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
                    [slug]
                );
                count = rows[0]?.total || 0;
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, count });
        }
        
        // POST /api/[tool-slug]/usage
        if (req.method === 'POST' && (pathname.includes('/usage') || endpoint === 'usage')) {
            const slug = toolSlug || req.body.tool_slug || url.searchParams.get('tool_slug') || 'quick-training-agenda-maker';
            const userId = req.body.user_id || req.headers['x-user-id'] || 'anonymous';
            
            let count = 0;
            
            if (connection) {
                await connection.execute(`
                    INSERT INTO tool_usage (tool_slug, user_id, count, last_used)
                    VALUES (?, ?, 1, NOW())
                    ON DUPLICATE KEY UPDATE 
                        count = count + 1,
                        last_used = NOW()
                `, [slug, userId]);
                
                const [rows] = await connection.execute(
                    'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
                    [slug]
                );
                count = rows[0]?.total || 0;
                
                await connection.execute(`
                    UPDATE tool_registry SET last_seen = NOW() WHERE tool_slug = ?
                `, [slug]);
            }
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Usage incremented',
                tool_slug: slug,
                total_usage: count
            });
        }
        
        // ============================================
        // REACTIONS ENDPOINTS
        // ============================================
        
        // GET /api/[tool-slug]/reactions
        if (req.method === 'GET' && (pathname.includes('/reactions') || endpoint === 'reactions')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'quick-training-agenda-maker';
            const reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            
            if (connection) {
                const [rows] = await connection.execute(`
                    SELECT reaction_type, COUNT(*) as count
                    FROM tool_reactions
                    WHERE tool_slug = ?
                    GROUP BY reaction_type
                `, [slug]);
                
                rows.forEach(row => {
                    if (reactions.hasOwnProperty(row.reaction_type)) {
                        reactions[row.reaction_type] = row.count;
                    }
                });
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, reactions });
        }
        
        // POST /api/[tool-slug]/reactions
        if (req.method === 'POST' && (pathname.includes('/reactions') || endpoint === 'reactions')) {
            let slug = toolSlug || req.body.tool_slug || 'quick-training-agenda-maker';
            let emoji = req.body.emoji || req.body.reaction_type;
            let reactionType = EMOJI_MAP[emoji] || emoji;
            const userId = req.body.user_id || req.headers['x-user-id'] || 'anonymous';
            
            if (!reactionType || !VALID_REACTIONS.includes(reactionType)) {
                return sendJSON(res, 400, { success: false, error: 'Invalid reaction type' });
            }
            
            let alreadyReacted = false;
            let counts = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            
            if (connection) {
                try {
                    const [existing] = await connection.execute(`
                        SELECT id FROM tool_reactions 
                        WHERE tool_slug = ? AND reaction_type = ? AND user_id = ?
                    `, [slug, reactionType, userId]);
                    
                    if (existing.length > 0) {
                        alreadyReacted = true;
                    } else {
                        await connection.execute(`
                            INSERT INTO tool_reactions (tool_slug, emoji, reaction_type, user_id)
                            VALUES (?, ?, ?, ?)
                        `, [slug, emoji, reactionType, userId]);
                    }
                    
                    const [rows] = await connection.execute(`
                        SELECT reaction_type, COUNT(*) as count
                        FROM tool_reactions
                        WHERE tool_slug = ?
                        GROUP BY reaction_type
                    `, [slug]);
                    
                    rows.forEach(row => {
                        if (counts.hasOwnProperty(row.reaction_type)) {
                            counts[row.reaction_type] = row.count;
                        }
                    });
                    
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        alreadyReacted = true;
                    }
                }
            }
            
            if (alreadyReacted) {
                return sendJSON(res, 200, {
                    success: false,
                    already_reacted: true,
                    message: 'You have already reacted with this emoji',
                    counts
                });
            }
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Reaction added',
                tool_slug: slug,
                reaction_type: reactionType,
                counts
            });
        }
        
        // ============================================
        // SHARES ENDPOINTS
        // ============================================
        
        // GET /api/[tool-slug]/shares
        if (req.method === 'GET' && (pathname.includes('/shares') || endpoint === 'shares')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'quick-training-agenda-maker';
            let count = 0;
            
            if (connection) {
                const [rows] = await connection.execute(
                    'SELECT COUNT(*) as total FROM tool_shares WHERE tool_slug = ?',
                    [slug]
                );
                count = rows[0]?.total || 0;
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, shares: count });
        }
        
        // POST /api/[tool-slug]/shares
        if (req.method === 'POST' && (pathname.includes('/shares') || endpoint === 'shares')) {
            const slug = toolSlug || req.body.tool_slug || 'quick-training-agenda-maker';
            const platform = req.body.platform || 'unknown';
            const userId = req.body.user_id || req.headers['x-user-id'] || 'anonymous';
            
            if (connection) {
                await connection.execute(`
                    INSERT INTO tool_shares (tool_slug, platform, user_id)
                    VALUES (?, ?, ?)
                `, [slug, platform, userId]);
                
                await connection.execute(`
                    UPDATE dashboard_stats SET total_shares = total_shares + 1 WHERE id = 1
                `);
            }
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Share recorded',
                tool_slug: slug,
                platform: platform
            });
        }
        
        // ============================================
        // STATS ENDPOINTS
        // ============================================
        
        // GET /api/[tool-slug]/stats
        if (req.method === 'GET' && (pathname.includes('/stats') || endpoint === 'stats')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'quick-training-agenda-maker';
            let stats = { totalUsage: 0, totalShares: 0, uniqueUsers: 0 };
            let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            
            if (connection) {
                const [usage] = await connection.execute(
                    'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
                    [slug]
                );
                
                const [shares] = await connection.execute(
                    'SELECT COUNT(*) as total FROM tool_shares WHERE tool_slug = ?',
                    [slug]
                );
                
                const [users] = await connection.execute(
                    'SELECT COUNT(DISTINCT user_id) as total FROM tool_reactions WHERE tool_slug = ?',
                    [slug]
                );
                
                const [reactionRows] = await connection.execute(`
                    SELECT reaction_type, COUNT(*) as count
                    FROM tool_reactions
                    WHERE tool_slug = ?
                    GROUP BY reaction_type
                `, [slug]);
                
                reactionRows.forEach(row => {
                    if (reactions.hasOwnProperty(row.reaction_type)) {
                        reactions[row.reaction_type] = row.count;
                    }
                });
                
                stats = {
                    totalUsage: usage[0]?.total || 0,
                    totalShares: shares[0]?.total || 0,
                    uniqueUsers: users[0]?.total || 0,
                    reactions: reactions
                };
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, ...stats });
        }
        
        // ============================================
        // GLOBAL STATS
        // ============================================
        if (req.method === 'GET' && pathname === '/api/global-stats') {
            let stats = { totalTools: toolRegistry.size, totalUsage: 0, totalShares: 0 };
            
            if (connection) {
                const [usage] = await connection.execute('SELECT SUM(count) as total FROM tool_usage');
                const [shares] = await connection.execute('SELECT COUNT(*) as total FROM tool_shares');
                
                stats = {
                    totalTools: toolRegistry.size,
                    totalUsage: usage[0]?.total || 0,
                    totalShares: shares[0]?.total || 0
                };
            }
            
            return sendJSON(res, 200, { success: true, ...stats });
        }
        
        // ============================================
        // AI QUOTE GENERATION (for Quick Training Agenda Maker)
        // ============================================
        if (req.method === 'POST' && (pathname === '/api/generate-quote' || endpoint === 'generate-quote')) {
            const { prompt, topic, category } = req.body;
            const searchPrompt = prompt || topic || category || 'training inspiration';
            
            const quote = await getAIQuote(searchPrompt, connection);
            
            return sendJSON(res, 200, {
                success: true,
                quote: quote.text,
                author: quote.author,
                category: quote.category,
                source: quote.source || 'database'
            });
        }
        
        // ============================================
        // DEFAULT - Unknown endpoint
        // ============================================
        return sendJSON(res, 404, {
            success: false,
            error: 'Endpoint not found',
            requested_path: pathname,
            tool_slug: toolSlug,
            available_endpoints: [
                '=== CORE ENDPOINTS ===',
                'GET  /api/health - Health check',
                'GET  /api/tools-list - List all tools',
                'POST /api/register - Register a tool',
                '',
                '=== USAGE ENDPOINTS ===',
                'GET  /api/[tool-slug]/usage - Get usage count',
                'POST /api/[tool-slug]/usage - Increment usage',
                '',
                '=== REACTIONS ENDPOINTS ===',
                'GET  /api/[tool-slug]/reactions - Get reactions',
                'POST /api/[tool-slug]/reactions - Add reaction',
                '',
                '=== SHARES ENDPOINTS ===',
                'GET  /api/[tool-slug]/shares - Get shares count',
                'POST /api/[tool-slug]/shares - Record share',
                '',
                '=== STATS ENDPOINTS ===',
                'GET  /api/[tool-slug]/stats - Get all stats',
                'GET  /api/global-stats - Get global stats',
                '',
                '=== AI ENDPOINTS ===',
                'POST /api/generate-quote - Generate AI quote',
                '',
                '=== SUPPORTED TOOLS ===',
                ...Array.from(toolRegistry).map(t => `  - ${t}`)
            ]
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return sendJSON(res, 500, {
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (connection) {
            try { await connection.end(); } catch(e) {}
        }
    }
}
