export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ebm',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 15,
  acquireTimeout: 60000,
  timeout: 60000
};



// src/config/database.ts
// export interface DatabaseConfig {
//   write: {
//     host: string;
//     user: string;
//     password: string;
//     database: string;
//     port: number;
//   };
//   read: {
//     host: string;
//     user: string;
//     password: string;
//     database: string;
//     port: number;
//   }[];
// }

// export const dbConfig: DatabaseConfig = {
//   write: {
//     host: process.env.DB_WRITE_HOST || 'master-db.example.com',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'your_database',
//     port: parseInt(process.env.DB_PORT || '3306'),
//   },
//   read: [
//     {
//       host: process.env.DB_READ_HOST_1 || 'replica1-db.example.com',
//       user: process.env.DB_USER || 'root',
//       password: process.env.DB_PASSWORD || '',
//       database: process.env.DB_NAME || 'your_database',
//       port: parseInt(process.env.DB_PORT || '3306'),
//     },
//     {
//       host: process.env.DB_READ_HOST_2 || 'replica2-db.example.com',
//       user: process.env.DB_USER || 'root',
//       password: process.env.DB_PASSWORD || '',
//       database: process.env.DB_NAME || 'your_database',
//       port: parseInt(process.env.DB_PORT || '3306'),
//     }
//   ]
// };