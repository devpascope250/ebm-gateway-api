"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EbmSyncStatusRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class EbmSyncStatusRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "ebm_sync_status";
    }
    async findByTinAndBhfIdEntityName(tin, bhfId, entityName) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND entityName= :entityName`;
        const result = await this.queryNamed(sql, { tin, bhfId, entityName });
        return result?.[0] ?? null;
    }
    async findByEntity(entityName, tx) {
        if (tx) {
            const sql = `SELECT * FROM ${this.tableName} WHERE entityName = :entityName`;
            const result = await tx.queryNamed(sql, { entityName });
            return result?.[0] ?? null;
        }
        else {
            const sql = `SELECT * FROM ${this.tableName} WHERE entityName = :entityName`;
            const result = await this.queryNamed(sql, { entityName });
            return result?.[0] ?? null;
        }
    }
    async findByTinAndBhfIdEntityWithTransaction(ebmSync, entityName, tx) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND entityName = :entityName`;
        const result = await tx.queryNamed(sql, { ...ebmSync, entityName });
        return result?.[0] ?? null;
    }
    async create(ebmSync) {
        const sql = `
            INSERT INTO ${this.tableName} (tin, bhfId, lastRequestDate)
            VALUES (:tin, :bhfId, :lastRequestDate)
        `;
        return await this.queryNamed(sql, ebmSync);
    }
    async createWithTransaction(ebmSync, entityName, tx) {
        const sql = `
            INSERT INTO ${this.tableName} (tin, bhfId, lastRequestDate, entityName)
            VALUES (:tin, :bhfId, :lastRequestDate,:entityName)
        `;
        if (tx) {
            return await tx.queryNamed(sql, { ...ebmSync, entityName });
        }
        else {
            return await this.queryNamed(sql, { ...ebmSync, entityName });
        }
    }
    async createWithTransactionByEntityName(lastRequestDate, entityName, tx) {
        if (tx) {
            const sql = `
                INSERT INTO ${this.tableName} (lastRequestDate, entityName)
                VALUES (:lastRequestDate, :entityName)
            `;
            return await tx.queryNamed(sql, { lastRequestDate, entityName });
        }
        else {
            const sql = `
            INSERT INTO ${this.tableName} (lastRequestDate, entityName)
            VALUES (:lastRequestDate, :entityName)
        `;
            return await this.queryNamed(sql, { lastRequestDate, entityName });
        }
    }
    async update(ebmSync) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE tin = :tin AND bhfId = :bhfId
        `;
        return await this.queryNamed(sql, ebmSync);
    }
    async updateWithTransaction(ebmSync, entityName, tx) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE tin = :tin AND bhfId = :bhfId AND entityName = :entityName
        `;
        if (tx) {
            return await tx.queryNamed(sql, { ...ebmSync, entityName });
        }
        else {
            return await this.queryNamed(sql, { ...ebmSync, entityName });
        }
    }
    async updateWithTransactionByEntityName(lastRequestDate, entityName, tx) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE entityName = :entityName`;
        return await tx.queryNamed(sql, { entityName, lastRequestDate });
    }
}
exports.EbmSyncStatusRepository = EbmSyncStatusRepository;
