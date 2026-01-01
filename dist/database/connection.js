"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const database_1 = require("../config/database");
class DatabaseConnection {
    constructor(config) {
        this.pool = promise_1.default.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port,
            connectionLimit: config.connectionLimit,
            charset: 'utf8mb4',
            timezone: '+02:00',
            // Enable for better performance
            namedPlaceholders: true,
            decimalNumbers: true,
            // Connection pool settings
            idleTimeout: 60000,
            maxIdle: 15,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        this.setupEventListeners();
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(database_1.dbConfig);
        }
        return DatabaseConnection.instance;
    }
    setupEventListeners() {
        this.pool.on('connection', (connection) => {
            console.log('New database connection established');
        });
        this.pool.on('acquire', (connection) => {
            console.log('Connection acquired');
        });
        this.pool.on('release', (connection) => {
            console.log('Connection released');
        });
        this.pool.on('error', (err) => {
            console.error('Database pool error:', err);
        });
    }
    getPool() {
        return this.pool;
    }
    async executeQuery(sql, params = []) {
        const [results, fields] = await this.pool.execute(sql, params);
        return { results: results, fields };
    }
    async executeQueryNamed(sql, params = {}) {
        const [results, fields] = await this.pool.execute(sql, params);
        return { results: results, fields };
    }
    async close() {
        await this.pool.end();
    }
}
exports.default = DatabaseConnection;
// src/database/connection.ts
// import mysql from 'mysql2/promise';
// import { dbConfig, DatabaseConfig } from '../config/database';
// class DatabaseConnection {
//   private static instance: DatabaseConnection;
//   private writePool: mysql.Pool;
//   private readPools: mysql.Pool[];
//   private currentReadIndex: number = 0;
//   private setupEventListeners(): void {
//   // Setup event listeners for write pool
//   this.writePool.on('connection', (connection) => {
//     console.log('New write database connection established');
//   });
//   this.writePool.on('error' as any, (err) => {
//     console.error('Write pool error:', err);
//   });
//   // Setup event listeners for read pools
//   this.readPools.forEach((pool, index) => {
//     pool.on('connection', (connection) => {
//       console.log(`New read database connection ${index} established`);
//     });
//     pool.on('error' as any, (err) => {
//       console.error(`Read pool ${index} error:`, err);
//     });
//   });
// }
//   private constructor(config: DatabaseConfig) {
//     // Write pool (master)
//     this.writePool = mysql.createPool({
//       ...config.write,
//       connectionLimit: 10,
//       namedPlaceholders: true,
//       decimalNumbers: true
//     });
//     // Read pools (replicas) - round-robin load balancing
//     this.readPools = config.read.map(replicaConfig => 
//       mysql.createPool({
//         ...replicaConfig,
//         connectionLimit: 15, // More connections for reads
//         namedPlaceholders: true,
//         decimalNumbers: true
//       })
//     );
//     this.setupEventListeners();
//   }
//   // Get a read pool using round-robin
//   private getReadPool(): mysql.Pool {
//     const pool = this.readPools[this.currentReadIndex];
//     this.currentReadIndex = (this.currentReadIndex + 1) % this.readPools.length;
//     return pool;
//   }
//   // For READ operations (can go to replicas)
//   public async queryReadOnly<T = any>(
//     sql: string, 
//     params: any[] = []
//   ): Promise<T> {
//     const pool = this.getReadPool();
//     const [results] = await pool.execute(sql, params);
//     return results as T;
//   }
//   // For WRITE operations (must go to master)
//   public async queryWrite<T = any>(
//     sql: string, 
//     params: any[] = []
//   ): Promise<T> {
//     const [results] = await this.writePool.execute(sql, params);
//     return results as T;
//   }
//   // Batch operations for better performance
//   public async executeBatch<T = any>(
//     queries: {sql: string, params: any[]}[]
//   ): Promise<T[]> {
//     const results: T[] = [];
//     for (const query of queries) {
//       // Use write pool for batch operations (assuming they might include writes)
//       const result = await this.queryWrite<T>(query.sql, query.params);
//       results.push(result);
//     }
//     return results;
//   }
//   // Transactional batch (all succeed or all fail)
//   public async executeTransactionalBatch<T = any>(
//     queries: {sql: string, params: any[]}[]
//   ): Promise<T[]> {
//     const connection = await this.writePool.getConnection();
//     try {
//       await connection.beginTransaction();
//       const results: T[] = [];
//       for (const query of queries) {
//         const [result] = await connection.execute(query.sql, query.params);
//         results.push(result as T);
//       }
//       await connection.commit();
//       return results;
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
// }
// export default DatabaseConnection;
