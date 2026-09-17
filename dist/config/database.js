import mysql from 'mysql2/promise';
import 'dotenv/config';
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventory_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
};
export const db = mysql.createPool(dbConfig);
export const testDbConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connected to MySQL database successfully.');
        connection.release();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Failed to connect to MySQL database:', message);
    }
};
