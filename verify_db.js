import mysql from 'mysql2/promise';

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3307,
            user: 'mspro',
            password: 'V3x*fbrpH6o%',
            database: 'mspro'
        });
        console.log('Successfully connected to MySQL via Tunnel!');
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

test();
