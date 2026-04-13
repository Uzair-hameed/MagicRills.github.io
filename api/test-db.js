
const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.TIDB_HOST,
            port: process.env.TIDB_PORT,
            user: process.env.TIDB_USERNAME,
            password: process.env.TIDB_PASSWORD,
            database: process.env.TIDB_DATABASE,
            ssl: { rejectUnauthorized: true }
        });

        const [rows] = await connection.execute('SELECT * FROM dashboard_stats');
        
        res.status(200).json({ 
            success: true, 
            data: rows,
            message: 'Database connected successfully!' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
