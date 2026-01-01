"use strict";
// import DatabaseConnection from '../database/connection';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
// export abstract class BaseRepository {
//   protected db: DatabaseConnection;
//   constructor() {
//     this.db = DatabaseConnection.getInstance();
//   }
//   protected async query<T = any>(sql: string, params: any[] = []): Promise<T> {
//     const { results } = await this.db.executeQuery<T>(sql, params);
//     return results;
//   }
//   protected async queryNamed<T = any>(
//     sql: string, 
//     params: { [key: string]: any } = {}
//   ): Promise<T> {
//     const { results } = await this.db.executeQueryNamed<T>(sql, params);
//     return results;
//   }
//   protected async transaction<T>(
//     callback: (connection: any) => Promise<T>
//   ): Promise<T> {
//     const connection = await this.db.getPool().getConnection();
//     try {
//       await connection.beginTransaction();
//       const result = await callback(connection);
//       await connection.commit();
//       return result;
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
// }
const connection_1 = __importDefault(require("../database/connection"));
class BaseRepository {
    constructor() {
        this.db = connection_1.default.getInstance();
    }
    async query(sql, params = []) {
        const { results } = await this.db.executeQuery(sql, params);
        return results;
    }
    async queryNamed(sql, params = {}) {
        const { results } = await this.db.executeQueryNamed(sql, params);
        return results;
    }
    async queryNamedWithArrays(sql, params = {}) {
        let positionalParams = [];
        let processedSql = sql;
        // Handle array parameters
        for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value)) {
                const placeholders = value.map(() => '?').join(',');
                processedSql = processedSql.replace(`:${key}`, placeholders);
                positionalParams.push(...value);
            }
            else {
                processedSql = processedSql.replace(`:${key}`, '?');
                positionalParams.push(value);
            }
        }
        const { results } = await this.db.executeQuery(processedSql, positionalParams);
        return results;
    }
    // Create a transaction-aware interface that wraps the connection
    createTransactionInterface(connection) {
        return {
            query: async (sql, params = []) => {
                const [rows] = await connection.execute(sql, params);
                return rows;
            },
            queryNamed: async (sql, params = {}) => {
                // Convert named parameters to positional parameters for MySQL
                const positionalParams = [];
                const positionalSql = sql.replace(/:(\w+)/g, (match, paramName) => {
                    if (paramName in params) {
                        positionalParams.push(params[paramName]);
                        return '?';
                    }
                    return match;
                });
                const [rows] = await connection.execute(positionalSql, positionalParams);
                return rows;
            }
        };
    }
    async transaction(callback) {
        const connection = await this.db.getPool().getConnection();
        try {
            await connection.beginTransaction();
            const txInterface = this.createTransactionInterface(connection);
            const result = await callback(txInterface);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    /**
     * Creates or updates a record based on the unique key constraints
     * @param tableName - The name of the table
     * @param data - The data to insert or update
     * @param conflictKeys - Array of column names that define uniqueness
     * @param updateColumns - Optional array of columns to update on conflict. If not provided, updates all columns except conflict keys
     */
    async createOrUpdate(tableName, data, conflictKeys, updateColumns) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map(() => '?').join(', ');
        const columnNames = columns.join(', ');
        // Build ON DUPLICATE KEY UPDATE clause
        let updateClause = '';
        if (updateColumns && updateColumns.length > 0) {
            updateClause = updateColumns.map(col => `${col} = VALUES(${col})`).join(', ');
        }
        else {
            // Update all columns except the conflict keys
            const columnsToUpdate = columns.filter(col => !conflictKeys.includes(col));
            updateClause = columnsToUpdate.map(col => `${col} = VALUES(${col})`).join(', ');
        }
        const sql = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE ${updateClause}
    `;
        const result = await this.query(sql, values);
        return result;
    }
    /**
     * Creates or updates a record using named parameters
     */
    async createOrUpdateNamed(tableName, data, conflictKeys, updateColumns) {
        const columns = Object.keys(data);
        const columnNames = columns.join(', ');
        const valuePlaceholders = columns.map(col => `:${col}`).join(', ');
        // Build ON DUPLICATE KEY UPDATE clause
        let updateClause = '';
        if (updateColumns && updateColumns.length > 0) {
            updateClause = updateColumns.map(col => `${col} = VALUES(${col})`).join(', ');
        }
        else {
            // Update all columns except the conflict keys
            const columnsToUpdate = columns.filter(col => !conflictKeys.includes(col));
            updateClause = columnsToUpdate.map(col => `${col} = VALUES(${col})`).join(', ');
        }
        const sql = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES (${valuePlaceholders})
      ON DUPLICATE KEY UPDATE ${updateClause}
    `;
        const result = await this.queryNamed(sql, data);
        return result;
    }
    /**
     * Creates multiple records in a single query
     * @param tableName - The name of the table
     * @param dataArray - Array of objects containing data for multiple records
     */
    async createMany(tableName, dataArray) {
        if (!dataArray.length) {
            throw new Error('Data array cannot be empty');
        }
        const columns = Object.keys(dataArray[0]);
        const columnNames = columns.join(', ');
        // Build placeholders for all rows
        const valuePlaceholders = dataArray.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
        // Flatten all values into a single array
        const values = dataArray.flatMap(row => columns.map(column => row[column]));
        const sql = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES ${valuePlaceholders}
    `;
        const result = await this.query(sql, values);
        return result;
    }
    /**
     * Creates multiple records using named parameters (for databases that support it)
     */
    async createManyNamed(tableName, dataArray) {
        if (!dataArray.length) {
            throw new Error('Data array cannot be empty');
        }
        const columns = Object.keys(dataArray[0]);
        const columnNames = columns.join(', ');
        // Build placeholders with unique named parameters
        const valuePlaceholders = dataArray.map((_, index) => `(${columns.map(col => `:${col}_${index}`).join(', ')})`).join(', ');
        // Create named parameters object
        const namedParams = {};
        dataArray.forEach((row, index) => {
            columns.forEach(column => {
                namedParams[`${column}_${index}`] = row[column];
            });
        });
        const sql = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES ${valuePlaceholders}
    `;
        const result = await this.queryNamed(sql, namedParams);
        return result;
    }
}
exports.BaseRepository = BaseRepository;
