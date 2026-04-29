// ============================================
// FILE: test-db.js
// UNIVERSAL API - ONE FILE FOR ALL TOOLS
// Works with: TiDB + Vercel + Cloudflare Workers
// Auto-detects new tools | No manual updates needed
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
        
        console.log('✅ All tables verified');
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
    // Pattern: /api/[tool-slug]/[endpoint] or /api/[endpoint]
    let toolSlug = null;
    let endpoint = null;
    
    if (pathParts[0] === 'api') {
        if (pathParts.length >= 2) {
            // Check if second part is a tool slug
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
                // Fallback to memory
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
                
                // Update registry
                await connection.execute(`
                    UPDATE tool_registry SET last_seen = NOW() WHERE tool_slug = ?
                `, [slug]);
            } else {
                // Fallback to memory
                if (!global.usageCache) global.usageCache = {};
                global.usageCache[slug] = (global.usageCache[slug] || 0) + 1;
                count = global.usageCache[slug];
            }
            
            // Cloudflare Workers compatible response
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
                    // Check if already reacted
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
                    
                    // Get updated counts
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
                
                // Update dashboard stats
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
        // LEGACY ENDPOINTS (Backward Compatible - Original test-db.js)
        // ============================================
        
        // GET /api/tool-stats (legacy)
        if (req.method === 'GET' && pathname === '/api/tool-stats') {
            const toolId = url.searchParams.get('tool_id') || 18;
            
            let usage = 0;
            let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
            let totalShares = 0;
            
            if (connection) {
                // Get tool usage
                const [usageRows] = await connection.execute(
                    'SELECT usage_count FROM tools WHERE tool_id = ?',
                    [toolId]
                );
                usage = usageRows.length > 0 ? usageRows[0].usage_count : 0;
                
                // Get reactions
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
                
                // Get shares
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
        // AI GENERATION ENDPOINTS (Grok API)
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
                '/api/health - Health check',
                '/api/tools-list - List all registered tools',
                '/api/register - Register a new tool',
                '/api/usage (GET/POST) - Get/increment usage',
                '/api/reactions (GET/POST) - Get/add reactions',
                '/api/shares (GET/POST) - Get/add shares',
                '/api/stats - Get tool statistics',
                '/api/global-stats - Get global statistics',
                '/api/tool-stats - Legacy tool stats',
                '/api/dashboard-stats - Legacy dashboard stats',
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
                'Example: /api/advanced-lesson-planner/usage'
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
