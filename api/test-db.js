// ============================================
// FILE: test-db.js
// UNIVERSAL API - ONE FILE FOR ALL TOOLS
// Works with: TiDB + Vercel + Cloudflare Workers
// Auto-detects new tools | No manual updates needed
// INCLUDES: Poster Generator Endpoints (AI Quotes, Save Design, Get Designs)
// ============================================

const mysql = require('mysql2/promise');

// ============================================
// CONFIGURATION
// ============================================

// All tools (auto-detects new ones)
let toolRegistry = new Set();
let registryLastUpdated = null;

// Pre-registered tools (existing + cloudflare workers)
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
    
    // Future tools will be auto-detected
];

// Emoji mapping for reactions
const EMOJI_MAP = {
    '👍': 'like', '❤️': 'love', '😮': 'wow', 
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate',
    'like': 'like', 'love': 'love', 'wow': 'wow',
    'sad': 'sad', 'angry': 'angry', 'laugh': 'laugh', 'celebrate': 'celebrate'
};

const VALID_REACTIONS = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];

// Quote database for fallback
const QUOTE_DATABASE = {
    education: [
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
        { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
        { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" }
    ],
    love: [
        { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
        { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
        { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" }
    ],
    success: [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" }
    ],
    wisdom: [
        { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" }
    ],
    motivation: [
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
    ],
    islamic: [
        { text: "Indeed, Allah is with those who are patient.", author: "Quran" },
        { text: "The best among you are those who have the best manners and character.", author: "Prophet Muhammad (PBUH)" }
    ],
    library: [
        { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
        { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" }
    ],
    default: [
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" }
    ]
};

// ============================================
// DATABASE CONNECTION (TiDB + Fallback)
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
        return connection;
    } catch (error) {
        console.error('TiDB Connection Error:', error);
        return null;
    }
}

// ============================================
// AUTO-DETECT NEW TOOLS (Runs every hour)
// ============================================

async function scanAndRegisterTools(connection) {
    const now = Date.now();
    if (registryLastUpdated && (now - registryLastUpdated) < 3600000) {
        return toolRegistry;
    }
    
    try {
        if (connection) {
            // Get tools from database
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
        
        // Add all preregistered tools
        PREREGISTERED_TOOLS.forEach(tool => toolRegistry.add(tool));
        
        registryLastUpdated = now;
        console.log(`✅ Tool registry updated: ${toolRegistry.size} tools detected`);
        
        // Initialize tables if needed
        if (connection) {
            await ensureTables(connection);
        }
        
    } catch (error) {
        console.error('Scan error:', error);
    }
    
    return toolRegistry;
}

// ============================================
// ENSURE TABLES EXIST (Auto-create if missing)
// ============================================

async function ensureTables(connection) {
    try {
        // Tools registry table
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
        
        // Usage table
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
        
        // Reactions table
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
                INDEX idx_cache_key (cache_key),
                INDEX idx_tool_slug (tool_slug)
            )
        `);
        
        // Poster Designs table (NEW for Poster Generator)
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
        
        // Poster Templates table (NEW for Poster Generator)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS poster_templates (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                template_slug VARCHAR(100) NOT NULL UNIQUE,
                template_name VARCHAR(200),
                template_category VARCHAR(50),
                template_data JSON,
                thumbnail TEXT,
            thumbnail TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_category (template_category)
            )
        `);
        
        // Legacy tables (for backward compatibility)
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
        
        // Insert default dashboard stats if empty
        await connection.execute(`
            INSERT IGNORE INTO dashboard_stats (id, total_views, total_shares, total_followers)
            VALUES (1, 0, 0, 0)
        `);
        
        console.log('✅ All tables verified (including poster_designs and poster_templates)');
    } catch (error) {
        console.error('Table creation error:', error);
    }
}

// ============================================
// CORS HEADERS HELPER
// ============================================

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
}

function sendJSON(res, status, data) {
    setCORS(res);
    res.status(status).json(data);
}

// ============================================
// CLOUD WORKERS COMPATIBLE RESPONSE
// ============================================

function cloudflareResponse(res, data) {
    setCORS(res);
    return res.status(200).json({
        success: true,
        source: 'cloudflare-worker-compatible',
        ...data
    });
}

// ============================================
// AI QUOTE GENERATION HELPER
// ============================================

function generateQuoteFromDatabase(prompt) {
    const promptLower = (prompt || '').toLowerCase();
    let category = 'default';
    
    if (promptLower.includes('education') || promptLower.includes('learn') || promptLower.includes('school')) {
        category = 'education';
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
    
    // Detect tool slug from URL pattern
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
        // ENDPOINT: /api/health - Health check
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/health' || endpoint === 'health')) {
            return sendJSON(res, 200, {
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                registeredTools: toolRegistry.size,
                database: connection ? 'connected' : 'disconnected',
                environment: process.env.VERCEL_ENV || 'development'
            });
        }
        
        // ============================================
        // ENDPOINT: /api/tools-list - List all tools
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/tools-list' || endpoint === 'tools')) {
            const tools = Array.from(toolRegistry).map(slug => ({ tool_slug: slug }));
            return sendJSON(res, 200, { success: true, tools, total: tools.length });
        }
        
        // ============================================
        // ENDPOINT: /api/register - Register new tool
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
                message: `Tool '${tool_slug}' registered successfully`,
                isNew: true
            });
        }
        
        // ============================================
        // USAGE COUNTER ENDPOINTS
        // ============================================
        
        // GET /api/usage or /api/[tool-slug]/usage
        if (req.method === 'GET' && (pathname === '/api/usage' || endpoint === 'usage')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'unknown';
            let count = 0;
            
            if (connection) {
                const [rows] = await connection.execute(
                    'SELECT SUM(count) as total FROM tool_usage WHERE tool_slug = ?',
                    [slug]
                );
                count = rows[0]?.total || 0;
            } else {
                count = global.usageCache?.[slug] || 0;
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, count });
        }
        
        // POST /api/increment-usage or /api/[tool-slug]/usage
        if (req.method === 'POST' && (pathname === '/api/increment-usage' || endpoint === 'usage')) {
            const slug = toolSlug || req.body.tool_slug || url.searchParams.get('tool_slug') || 'unknown';
            const userId = req.body.user_id || req.body.session_id || 'anonymous';
            
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
            } else {
                if (!global.usageCache) global.usageCache = {};
                global.usageCache[slug] = (global.usageCache[slug] || 0) + 1;
                count = global.usageCache[slug];
            }
            
            return cloudflareResponse(res, {
                message: 'Usage incremented',
                tool_slug: slug,
                total_usage: count
            });
        }
        
        // ============================================
        // REACTIONS ENDPOINTS
        // ============================================
        
        // GET /api/reactions or /api/[tool-slug]/reactions
        if (req.method === 'GET' && (pathname === '/api/reactions' || endpoint === 'reactions')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'unknown';
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
        
        // POST /api/add-reaction or /api/[tool-slug]/reactions
        if (req.method === 'POST' && (pathname === '/api/add-reaction' || endpoint === 'reactions')) {
            let slug = toolSlug || req.body.tool_slug || 'unknown';
            let emoji = req.body.emoji || req.body.reaction_type;
            let reactionType = EMOJI_MAP[emoji] || emoji;
            const userId = req.body.user_id || req.body.session_id || 'anonymous';
            
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
            
            return cloudflareResponse(res, {
                message: 'Reaction added',
                tool_slug: slug,
                reaction_type: reactionType,
                counts
            });
        }
        
        // ============================================
        // SHARES ENDPOINTS
        // ============================================
        
        // GET /api/shares or /api/[tool-slug]/shares
        if (req.method === 'GET' && (pathname === '/api/shares' || endpoint === 'shares')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'unknown';
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
        
        // POST /api/add-share or /api/[tool-slug]/shares
        if (req.method === 'POST' && (pathname === '/api/add-share' || endpoint === 'shares')) {
            const slug = toolSlug || req.body.tool_slug || 'unknown';
            const platform = req.body.platform || 'unknown';
            const userId = req.body.user_id || req.body.session_id || 'anonymous';
            
            if (connection) {
                await connection.execute(`
                    INSERT INTO tool_shares (tool_slug, platform, user_id)
                    VALUES (?, ?, ?)
                `, [slug, platform, userId]);
                
                await connection.execute(`
                    UPDATE dashboard_stats SET total_shares = total_shares + 1 WHERE id = 1
                `);
            }
            
            return cloudflareResponse(res, {
                message: 'Share recorded',
                tool_slug: slug,
                platform: platform
            });
        }
        
        // ============================================
        // STATS ENDPOINTS
        // ============================================
        
        // GET /api/stats or /api/[tool-slug]/stats
        if (req.method === 'GET' && (pathname === '/api/stats' || endpoint === 'stats')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'unknown';
            let stats = { totalUsage: 0, totalShares: 0, uniqueUsers: 0 };
            
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
                
                stats = {
                    totalUsage: usage[0]?.total || 0,
                    totalShares: shares[0]?.total || 0,
                    uniqueUsers: users[0]?.total || 0
                };
            }
            
            return sendJSON(res, 200, { success: true, tool_slug: slug, ...stats });
        }
        
        // GET /api/global-stats
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
        // POSTER GENERATOR: AI QUOTE GENERATION (NEW)
        // ============================================
        if (req.method === 'POST' && (pathname === '/api/generate-quote' || endpoint === 'generate-quote')) {
            const { prompt, topic, category } = req.body;
            const searchPrompt = prompt || topic || category || 'inspiration';
            
            let quote = generateQuoteFromDatabase(searchPrompt);
            
            // Check cache first
            let cachedResponse = null;
            if (connection) {
                const [rows] = await connection.execute(
                    'SELECT response FROM ai_cache WHERE cache_key = ? AND expires_at > NOW()',
                    [`quote_${searchPrompt.toLowerCase()}`]
                );
                if (rows.length > 0) {
                    cachedResponse = JSON.parse(rows[0].response);
                }
            }
            
            if (cachedResponse) {
                quote = cachedResponse;
            } else {
                // Try Grok API if API key is available
                const grokApiKey = process.env.GROK_API_KEY;
                if (grokApiKey) {
                    try {
                        // This is where you would call Grok API
                        // For now, we enhance the database quote
                        quote.text = `"${searchPrompt.charAt(0).toUpperCase() + searchPrompt.slice(1)} transforms ordinary moments into extraordinary memories. Keep believing in yourself!"`;
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
                            `, [`quote_${searchPrompt.toLowerCase()}`, 'poster-generator', 'quote', JSON.stringify(quote)]);
                        }
                    } catch (grokError) {
                        console.error('Grok API error:', grokError);
                    }
                }
            }
            
            return sendJSON(res, 200, {
                success: true,
                quote: quote.text,
                author: quote.author,
                category: quote.category,
                source: quote.source || 'database'
            });
        }
        
        // ============================================
        // POSTER GENERATOR: SAVE DESIGN (NEW)
        // ============================================
        if (req.method === 'POST' && (pathname === '/api/save-design' || endpoint === 'save-design')) {
            const { tool_slug, user_id, design_name, design_json, thumbnail } = req.body;
            
            if (!tool_slug || !design_json) {
                return sendJSON(res, 400, { success: false, error: 'tool_slug and design_json required' });
            }
            
            let designId = null;
            
            if (connection) {
                try {
                    const [result] = await connection.execute(`
                        INSERT INTO poster_designs (tool_slug, user_id, design_name, design_json, thumbnail)
                        VALUES (?, ?, ?, ?, ?)
                    `, [tool_slug, user_id || 'anonymous', design_name || `Design_${Date.now()}`, design_json, thumbnail || null]);
                    
                    designId = result.insertId;
                    
                    // Register tool if not exists
                    toolRegistry.add(tool_slug);
                    await connection.execute(`
                        INSERT INTO tool_registry (tool_slug, tool_name, is_active, last_seen)
                        VALUES (?, ?, TRUE, NOW())
                        ON DUPLICATE KEY UPDATE last_seen = NOW()
                    `, [tool_slug, design_name || 'Poster Design']);
                    
                } catch (error) {
                    console.error('Save design error:', error);
                    return sendJSON(res, 500, { success: false, error: 'Database error' });
                }
            }
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Design saved successfully',
                design_id: designId,
                saved_locally: !connection
            });
        }
        
        // ============================================
        // POSTER GENERATOR: GET DESIGNS (NEW)
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/get-designs' || endpoint === 'get-designs')) {
            const slug = toolSlug || url.searchParams.get('tool_slug') || 'poster-generator';
            const userId = url.searchParams.get('user_id') || 'anonymous';
            const limit = parseInt(url.searchParams.get('limit') || '20');
            
            let designs = [];
            
            if (connection) {
                try {
                    const [rows] = await connection.execute(`
                        SELECT id, tool_slug, design_name, thumbnail, created_at
                        FROM poster_designs
                        WHERE tool_slug = ? AND (user_id = ? OR user_id = 'anonymous')
                        ORDER BY created_at DESC
                        LIMIT ?
                    `, [slug, userId, limit]);
                    
                    designs = rows;
                } catch (error) {
                    console.error('Get designs error:', error);
                }
            }
            
            return sendJSON(res, 200, {
                success: true,
                designs: designs,
                total: designs.length,
                source: connection ? 'tidb' : 'local'
            });
        }
        
        // ============================================
        // POSTER GENERATOR: GET SINGLE DESIGN (NEW)
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/get-design' || endpoint === 'get-design')) {
            const designId = url.searchParams.get('id');
            
            if (!designId) {
                return sendJSON(res, 400, { success: false, error: 'design_id required' });
            }
            
            let design = null;
            
            if (connection) {
                try {
                    const [rows] = await connection.execute(`
                        SELECT id, tool_slug, design_name, design_json, thumbnail, created_at
                        FROM poster_designs
                        WHERE id = ?
                    `, [designId]);
                    
                    if (rows.length > 0) {
                        design = rows[0];
                    }
                } catch (error) {
                    console.error('Get design error:', error);
                }
            }
            
            if (!design) {
                return sendJSON(res, 404, { success: false, error: 'Design not found' });
            }
            
            return sendJSON(res, 200, {
                success: true,
                design: design
            });
        }
        
        // ============================================
        // POSTER GENERATOR: DELETE DESIGN (NEW)
        // ============================================
        if (req.method === 'DELETE' && (pathname === '/api/delete-design' || endpoint === 'delete-design')) {
            const designId = req.body.id || url.searchParams.get('id');
            const userId = req.body.user_id || url.searchParams.get('user_id') || 'anonymous';
            
            if (!designId) {
                return sendJSON(res, 400, { success: false, error: 'design_id required' });
            }
            
            let deleted = false;
            
            if (connection) {
                try {
                    const [result] = await connection.execute(`
                        DELETE FROM poster_designs
                        WHERE id = ? AND (user_id = ? OR user_id = 'anonymous')
                    `, [designId, userId]);
                    
                    deleted = result.affectedRows > 0;
                } catch (error) {
                    console.error('Delete design error:', error);
                }
            }
            
            return sendJSON(res, 200, {
                success: deleted,
                message: deleted ? 'Design deleted successfully' : 'Design not found or already deleted'
            });
        }
        
        // ============================================
        // POSTER GENERATOR: GET TEMPLATES (NEW)
        // ============================================
        if (req.method === 'GET' && (pathname === '/api/get-templates' || endpoint === 'get-templates')) {
            const category = url.searchParams.get('category') || 'all';
            
            let templates = [];
            
            if (connection) {
                try {
                    let query = 'SELECT id, template_slug, template_name, template_category, thumbnail FROM poster_templates WHERE is_active = TRUE';
                    const params = [];
                    
                    if (category !== 'all') {
                        query += ' AND template_category = ?';
                        params.push(category);
                    }
                    
                    query += ' ORDER BY created_at DESC';
                    
                    const [rows] = await connection.execute(query, params);
                    templates = rows;
                } catch (error) {
                    console.error('Get templates error:', error);
                }
            }
            
            // Return default templates if none in database
            if (templates.length === 0) {
                templates = [
                    { id: 1, template_slug: 'library-whats-on', template_name: 'Library What\'s On', template_category: 'library', thumbnail: null },
                    { id: 2, template_slug: 'book-fair', template_name: 'Book Fair', template_category: 'library', thumbnail: null },
                    { id: 3, template_slug: 'school-announcement', template_name: 'School Announcement', template_category: 'education', thumbnail: null },
                    { id: 4, template_slug: 'corporate-event', template_name: 'Corporate Event', template_category: 'business', thumbnail: null },
                    { id: 5, template_slug: 'wedding', template_name: 'Wedding Celebration', template_category: 'events', thumbnail: null },
                    { id: 6, template_slug: 'eid-mubarak', template_name: 'Eid Mubarak', template_category: 'islamic', thumbnail: null },
                    { id: 7, template_slug: 'valentine', template_name: 'Valentine\'s Day', template_category: 'love', thumbnail: null },
                    { id: 8, template_slug: 'graduation', template_name: 'Graduation', template_category: 'education', thumbnail: null }
                ];
            }
            
            return sendJSON(res, 200, {
                success: true,
                templates: templates,
                total: templates.length
            });
        }
        
        // ============================================
        // LEGACY ENDPOINTS (Backward Compatible)
        // ============================================
        
        // GET /api/tool-stats (legacy)
        if (req.method === 'GET' && pathname === '/api/tool-stats') {
            const toolId = url.searchParams.get('tool_id') || 18;
            
            let usage = 0;
            let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            let totalShares = 0;
            
            if (connection) {
                const [usageRows] = await connection.execute(
                    'SELECT usage_count FROM tools WHERE tool_id = ?',
                    [toolId]
                );
                usage = usageRows.length > 0 ? usageRows[0].usage_count : 0;
                
                const [reactionRows] = await connection.execute(
                    `SELECT reaction_type, COUNT(*) as count 
                     FROM tool_reactions 
                     WHERE tool_slug = ? 
                     GROUP BY reaction_type`,
                    [`tool_${toolId}`]
                );
                
                reactionRows.forEach(row => {
                    if (reactions.hasOwnProperty(row.reaction_type)) {
                        reactions[row.reaction_type] = row.count;
                    }
                });
                
                const [shareRows] = await connection.execute(
                    'SELECT COUNT(*) as total FROM tool_shares WHERE tool_slug = ?',
                    [`tool_${toolId}`]
                );
                totalShares = shareRows[0]?.total || 0;
            }
            
            const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
            
            return sendJSON(res, 200, {
                success: true,
                usage: usage,
                total_reactions: totalReactions,
                total_shares: totalShares,
                reactions: reactions,
                tool_id: toolId
            });
        }
        
        // GET /api/dashboard-stats (legacy)
        if (req.method === 'GET' && pathname === '/api/dashboard-stats') {
            if (connection) {
                const [rows] = await connection.execute('SELECT * FROM dashboard_stats');
                return sendJSON(res, 200, { 
                    success: true, 
                    data: rows,
                    message: 'Database connected successfully!' 
                });
            }
            return sendJSON(res, 200, { 
                success: true, 
                data: [{ total_views: 0, total_shares: 0, total_followers: 0 }],
                message: 'Using fallback data (database not connected)'
            });
        }
        
        // GET /api/tools-list-legacy (alternative)
        if (req.method === 'GET' && pathname === '/api/tools-list-legacy') {
            if (connection) {
                const [rows] = await connection.execute('SELECT tool_id, name, category, usage_count FROM tools ORDER BY tool_id');
                return sendJSON(res, 200, { success: true, tools: rows });
            }
            return sendJSON(res, 200, { success: true, tools: [] });
        }
        
        // ============================================
        // FAVICON GENERATOR SPECIFIC (Legacy support)
        // ============================================
        if (req.method === 'POST' && pathname === '/api/favicon-generate') {
            const { text, size, color } = req.body;
            return sendJSON(res, 200, {
                success: true,
                message: 'Favicon generated',
                url: `https://via.placeholder.com/${size || 64}/${color || '4285f4'}/ffffff?text=${encodeURIComponent(text || 'F')}`
            });
        }
        
        // ============================================
        // AI GENERATION ENDPOINTS (Grok API - Legacy)
        // ============================================
        
        // POST /api/generate-slos
        if (req.method === 'POST' && (pathname === '/api/generate-slos' || endpoint === 'generate-slos')) {
            const { subject, topic, grade } = req.body;
            
            const slos = [
                `Demonstrate understanding of ${topic || subject} concepts`,
                `Apply ${subject} knowledge to solve real-world problems`,
                `Analyze and evaluate key aspects of ${topic || subject}`,
                `Create innovative solutions using ${subject} principles`,
                `Communicate ${subject} ideas effectively in written and oral form`
            ];
            
            return sendJSON(res, 200, { success: true, slos });
        }
        
        // POST /api/generate-activities
        if (req.method === 'POST' && (pathname === '/api/generate-activities' || endpoint === 'generate-activities')) {
            const { subject, methodologies } = req.body;
            
            const activities = [
                `Introduction to ${subject} - Hook and engagement`,
                `Interactive ${methodologies?.[0] || 'lecture'} on key concepts`,
                `Group discussion and collaborative learning`,
                `Hands-on ${subject} activity or experiment`,
                `Formative assessment and feedback session`,
                `Review, Q&A, and exit ticket`
            ];
            
            return sendJSON(res, 200, { success: true, activities });
        }
        
        // POST /api/generate-full-lesson
        if (req.method === 'POST' && (pathname === '/api/generate-full-lesson' || endpoint === 'generate-full-lesson')) {
            const { subject, topic, className, duration } = req.body;
            
            const result = {
                slos: [`Understand ${topic || subject}`, `Apply ${subject} knowledge`],
                activities: [`Introduction (5 min)`, `Main activity (${duration ? parseInt(duration) - 15 : 30} min)`, `Assessment (10 min)`],
                resources: [`${subject} textbook`, `Worksheet`, `Presentation slides`],
                methodologyNotes: `Using interactive and student-centered approaches`,
                hometask: `Complete the ${subject} worksheet and prepare for next class`
            };
            
            return sendJSON(res, 200, { success: true, ...result });
        }
        
        // POST /api/generate-mcqs (for MCQ maker)
        if (req.method === 'POST' && (pathname === '/api/generate-mcqs' || endpoint === 'generate-mcqs')) {
            const { subject, topic, count, difficulty } = req.body;
            
            const mcqs = Array.from({ length: parseInt(count) || 5 }, (_, i) => ({
                id: i + 1,
                question: `Sample ${subject} question ${i + 1} about ${topic || subject}?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'A',
                explanation: `This is a sample ${difficulty || 'medium'} difficulty question.`
            }));
            
            return sendJSON(res, 200, { success: true, mcqs });
        }
        
        // POST /api/generate-paper (for paper generator)
        if (req.method === 'POST' && (pathname === '/api/generate-paper' || endpoint === 'generate-paper')) {
            const { subject, grade, topics } = req.body;
            
            const paper = {
                title: `${subject} Examination - ${grade} Grade`,
                totalMarks: 100,
                duration: '2 hours',
                sectionA: { name: 'Multiple Choice Questions', marks: 20, questions: [] },
                sectionB: { name: 'Short Answer Questions', marks: 30, questions: [] },
                sectionC: { name: 'Long Answer Questions', marks: 50, questions: [] }
            };
            
            return sendJSON(res, 200, { success: true, paper });
        }
        
        // POST /api/generate-mindmap
        if (req.method === 'POST' && (pathname === '/api/generate-mindmap' || endpoint === 'generate-mindmap')) {
            const { topic, subject } = req.body;
            
            const mindmap = {
                central: topic || subject,
                branches: [
                    { name: 'Main Concept 1', subBranches: ['Detail A', 'Detail B'] },
                    { name: 'Main Concept 2', subBranches: ['Detail C', 'Detail D'] },
                    { name: 'Main Concept 3', subBranches: ['Detail E', 'Detail F'] }
                ]
            };
            
            return sendJSON(res, 200, { success: true, mindmap });
        }
        
        // POST /api/generate-research-proposal
        if (req.method === 'POST' && (pathname === '/api/generate-research-proposal' || endpoint === 'generate-research-proposal')) {
            const { field, topic, level } = req.body;
            
            const proposal = {
                title: `Research on ${topic || field}`,
                abstract: `This research explores key aspects of ${field}...`,
                introduction: `Background and significance of ${field}...`,
                literatureReview: `Review of existing literature on ${field}...`,
                methodology: `Research methodology for ${field} study...`,
                expectedOutcomes: `Expected outcomes and contributions...`,
                timeline: `6 months timeline for completion`,
                references: `List of references`
            };
            
            return sendJSON(res, 200, { success: true, proposal });
        }
        
        // POST /api/generate-case-study
        if (req.method === 'POST' && (pathname === '/api/generate-case-study' || endpoint === 'generate-case-study')) {
            const { subject, scenario, grade } = req.body;
            
            const caseStudy = {
                title: `Case Study: ${scenario || subject} Application`,
                background: `Background information about the scenario...`,
                problemStatement: `Key challenges and issues identified...`,
                keyQuestions: [`Question 1`, `Question 2`, `Question 3`],
                discussionPoints: [`Point A`, `Point B`, `Point C`],
                solutionFramework: `Recommended approach and solutions...`
            };
            
            return sendJSON(res, 200, { success: true, caseStudy });
        }
        
        // POST /api/generate-differentiated
        if (req.method === 'POST' && (pathname === '/api/generate-differentiated' || endpoint === 'generate-differentiated')) {
            const { subject, topic, studentLevels } = req.body;
            
            const ideas = {
                belowGrade: [
                    `Simplified ${topic} activity with visual aids`,
                    `One-on-one support and guided practice`,
                    `Modified worksheets with fewer problems`
                ],
                atGrade: [
                    `Standard ${topic} lesson with collaborative learning`,
                    `Independent practice with feedback`,
                    `Group discussion and peer teaching`
                ],
                aboveGrade: [
                    `Advanced ${topic} challenge problems`,
                    `Extension activities and research projects`,
                    `Peer mentoring and leadership opportunities`
                ]
            };
            
            return sendJSON(res, 200, { success: true, ideas });
        }
        
        // ============================================
        // DEFAULT - Unknown endpoint
        // ============================================
        return sendJSON(res, 404, {
            success: false,
            error: 'Endpoint not found',
            available_endpoints: [
                '=== CORE ENDPOINTS ===',
                '/api/health - Health check',
                '/api/tools-list - List all registered tools',
                '/api/register - Register a new tool',
                '/api/usage (GET/POST) - Get/increment usage',
                '/api/reactions (GET/POST) - Get/add reactions',
                '/api/shares (GET/POST) - Get/add shares',
                '/api/stats - Get tool statistics',
                '/api/global-stats - Get global statistics',
                '',
                '=== POSTER GENERATOR ENDPOINTS (NEW) ===',
                '/api/generate-quote (POST) - AI quote generation',
                '/api/save-design (POST) - Save poster design',
                '/api/get-designs (GET) - Get user designs',
                '/api/get-design (GET) - Get single design by ID',
                '/api/delete-design (DELETE) - Delete a design',
                '/api/get-templates (GET) - Get poster templates',
                '',
                '=== LEGACY ENDPOINTS ===',
                '/api/tool-stats - Legacy tool stats',
                '/api/dashboard-stats - Legacy dashboard stats',
                '/api/tools-list-legacy - Legacy tools list',
                '/api/generate-slos - AI generate SLOs',
                '/api/generate-activities - AI generate activities',
                '/api/generate-full-lesson - AI generate full lesson',
                '/api/generate-mcqs - AI generate MCQs',
                '/api/generate-paper - AI generate paper',
                '/api/generate-mindmap - AI generate mind map',
                '/api/generate-research-proposal - AI generate research proposal',
                '/api/generate-case-study - AI generate case study',
                '/api/generate-differentiated - AI generate differentiated instruction',
                '',
                'For tool-specific calls: /api/[tool-slug]/[endpoint]',
                'Example: /api/teacher-resource-finder/usage'
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
