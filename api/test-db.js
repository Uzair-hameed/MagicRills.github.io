// ============================================
// FILE: test-db.js
// COMPLETE API - ALL ENDPOINTS IN ONE FILE
// Favicon Generator - TiDB Connected
// ============================================

const mysql = require('mysql2/promise');

// Database connection helper
async function getConnection() {
    return await mysql.createConnection({
        host: process.env.TIDB_HOST,
        port: process.env.TIDB_PORT || 4000,
        user: process.env.TIDB_USERNAME,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: { rejectUnauthorized: true }
    });
}

// Helper to send JSON response with CORS
function sendJSON(res, status, data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(status).json(data);
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    let connection = null;

    try {
        connection = await getConnection();

        // ========== ENDPOINT 1: TOOL STATS ==========
        if (req.method === 'GET' && pathname === '/api/tool-stats') {
            const tool_id = url.searchParams.get('tool_id') || 18;
            
            // Get tool usage
            const [usageRows] = await connection.execute(
                'SELECT usage_count FROM tools WHERE tool_id = ?',
                [tool_id]
            );
            const usage = usageRows.length > 0 ? usageRows[0].usage_count : 0;
            
            // Get reactions
            const [reactionRows] = await connection.execute(
                `SELECT reaction_type, COUNT(*) as count 
                 FROM reactions 
                 WHERE tool_id = ? 
                 GROUP BY reaction_type`,
                [tool_id]
            );
            
            const reactions = {
                like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
            };
            reactionRows.forEach(row => {
                reactions[row.reaction_type] = row.count;
            });
            
            const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
            
            // Get shares
            const [shareRows] = await connection.execute(
                'SELECT COUNT(*) as total FROM shares WHERE tool_id = ?',
                [tool_id]
            );
            const totalShares = shareRows[0]?.total || 0;
            
            return sendJSON(res, 200, {
                success: true,
                usage: usage,
                total_reactions: totalReactions,
                total_shares: totalShares,
                reactions: reactions,
                tool_id: tool_id
            });
        }

        // ========== ENDPOINT 2: INCREMENT USAGE ==========
        if (req.method === 'POST' && pathname === '/api/increment-usage') {
            const { tool_id, session_id } = req.body || {};
            const toolId = tool_id || 18;
            
            // Update tool usage
            await connection.execute(
                `INSERT INTO tools (tool_id, usage_count, name, category) 
                 VALUES (?, 1, 'Favicon Generator', 'design') 
                 ON DUPLICATE KEY UPDATE usage_count = usage_count + 1`,
                [toolId]
            );
            
            // Insert usage log
            await connection.execute(
                `INSERT INTO usage_logs (tool_id, session_id, user_ip) 
                 VALUES (?, ?, ?)`,
                [toolId, session_id || 'anonymous', req.headers['x-forwarded-for'] || req.socket.remoteAddress]
            );
            
            // Update dashboard stats
            await connection.execute(
                `UPDATE dashboard_stats SET total_views = total_views + 1 WHERE id = 1`
            );
            
            // Get updated count
            const [rows] = await connection.execute(
                'SELECT usage_count FROM tools WHERE tool_id = ?',
                [toolId]
            );
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Usage incremented successfully',
                total_usage: rows[0]?.usage_count || 0,
                tool_id: toolId
            });
        }

        // ========== ENDPOINT 3: ADD REACTION ==========
        if (req.method === 'POST' && pathname === '/api/add-reaction') {
            const { tool_id, reaction_type, session_id } = req.body || {};
            const toolId = tool_id || 18;
            
            const validReactions = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
            if (!validReactions.includes(reaction_type)) {
                return sendJSON(res, 400, { success: false, error: 'Invalid reaction type' });
            }
            
            // Check if already reacted
            const [existing] = await connection.execute(
                `SELECT id FROM reactions 
                 WHERE tool_id = ? AND reaction_type = ? AND session_id = ?`,
                [toolId, reaction_type, session_id || 'anonymous']
            );
            
            if (existing.length > 0) {
                return sendJSON(res, 200, { 
                    success: false, 
                    already_reacted: true,
                    message: 'You have already reacted with this emoji' 
                });
            }
            
            // Insert reaction
            await connection.execute(
                `INSERT INTO reactions (tool_id, reaction_type, session_id, user_ip) 
                 VALUES (?, ?, ?, ?)`,
                [toolId, reaction_type, session_id || 'anonymous', req.headers['x-forwarded-for'] || req.socket.remoteAddress]
            );
            
            // Update dashboard stats
            await connection.execute(
                `UPDATE dashboard_stats SET total_followers = total_followers + 1 WHERE id = 1`
            );
            
            // Get updated counts
            const [counts] = await connection.execute(
                `SELECT reaction_type, COUNT(*) as count 
                 FROM reactions 
                 WHERE tool_id = ? 
                 GROUP BY reaction_type`,
                [toolId]
            );
            
            const reactionCounts = {
                like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
            };
            counts.forEach(row => {
                reactionCounts[row.reaction_type] = row.count;
            });
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Reaction added successfully',
                tool_id: toolId,
                reaction_type: reaction_type,
                counts: reactionCounts
            });
        }

        // ========== ENDPOINT 4: ADD SHARE ==========
        if (req.method === 'POST' && pathname === '/api/add-share') {
            const { tool_id, platform, session_id } = req.body || {};
            const toolId = tool_id || 18;
            
            // Insert share
            await connection.execute(
                `INSERT INTO shares (tool_id, platform, session_id, user_ip) 
                 VALUES (?, ?, ?, ?)`,
                [toolId, platform || 'unknown', session_id || 'anonymous', req.headers['x-forwarded-for'] || req.socket.remoteAddress]
            );
            
            // Update dashboard stats
            await connection.execute(
                `UPDATE dashboard_stats SET total_shares = total_shares + 1 WHERE id = 1`
            );
            
            // Get total shares
            const [rows] = await connection.execute(
                'SELECT COUNT(*) as total FROM shares WHERE tool_id = ?',
                [toolId]
            );
            
            return sendJSON(res, 200, {
                success: true,
                message: 'Share recorded successfully',
                tool_id: toolId,
                platform: platform,
                total_shares: rows[0]?.total || 0
            });
        }

        // ========== ENDPOINT 5: DASHBOARD STATS (Original test endpoint) ==========
        if (req.method === 'GET' && pathname === '/api/dashboard-stats') {
            const [rows] = await connection.execute('SELECT * FROM dashboard_stats');
            return sendJSON(res, 200, { 
                success: true, 
                data: rows,
                message: 'Database connected successfully!' 
            });
        }

        // ========== ENDPOINT 6: TOOLS LIST ==========
        if (req.method === 'GET' && pathname === '/api/tools-list') {
            const [rows] = await connection.execute('SELECT tool_id, name, category, usage_count FROM tools ORDER BY tool_id');
            return sendJSON(res, 200, { success: true, tools: rows });
        }

        // ========== DEFAULT: Unknown endpoint ==========
        return sendJSON(res, 404, { 
            success: false, 
            error: 'Endpoint not found. Available: /api/tool-stats, /api/increment-usage, /api/add-reaction, /api/add-share, /api/dashboard-stats, /api/tools-list'
        });

    } catch (error) {
        console.error('API Error:', error);
        return sendJSON(res, 500, { 
            success: false, 
            error: error.message 
        });
    } finally {
        if (connection) await connection.end();
    }
}
