// BD MySQL de maneira assíncrona
import mysql from 'mysql2/promise';

export default async function Conectar() {
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();
    } else {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            port: 3306,
            password: '',
            database: 'bd_eleicao',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        global.poolConexoes = pool;
        
        return await global.poolConexoes.getConnection();
    }
}