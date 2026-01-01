import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { TableModal } from "../types/types";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class EbmSyncStatusRepository extends BaseRepository {
    private tableName = "ebm_sync_status";


    public async findByTinAndBhfIdEntityName(tin: string, bhfId: string, entityName: TableModal): Promise<EbmSyncStatus | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND entityName= :entityName`;
        const result = await this.queryNamed(sql, { tin, bhfId, entityName});
        return result?.[0] ?? null;
    }

    public async findByEntity(entityName: string, tx?: TransactionInterface): Promise<EbmSyncStatus | null> {
        if (tx) {
            const sql = `SELECT * FROM ${this.tableName} WHERE entityName = :entityName`;
            const result = await tx.queryNamed(sql, { entityName });
            return result?.[0] ?? null;
        } else {
            const sql = `SELECT * FROM ${this.tableName} WHERE entityName = :entityName`;
            const result = await this.queryNamed(sql, { entityName });
            return result?.[0] ?? null;
        }

    }

    public async findByTinAndBhfIdEntityWithTransaction(ebmSync: EbmSyncStatus, entityName: TableModal, tx: TransactionInterface): Promise<EbmSyncStatus | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND entityName = :entityName`;
        const result = await tx.queryNamed(sql, { ...ebmSync, entityName });
        return result?.[0] ?? null;
    }

    public async create(ebmSync: EbmSyncStatus) {
        const sql = `
            INSERT INTO ${this.tableName} (tin, bhfId, lastRequestDate)
            VALUES (:tin, :bhfId, :lastRequestDate)
        `;
        return await this.queryNamed(sql, ebmSync);
    }
    public async createWithTransaction(ebmSync: EbmSyncStatus,entityName: TableModal, tx: TransactionInterface) {
        const sql = `
            INSERT INTO ${this.tableName} (tin, bhfId, lastRequestDate, entityName)
            VALUES (:tin, :bhfId, :lastRequestDate,:entityName)
        `;
        if(tx) {
            return await tx.queryNamed(sql, {...ebmSync, entityName});
        }else{
            return await this.queryNamed(sql, {...ebmSync, entityName});
        }
        
    }

    public async createWithTransactionByEntityName(lastRequestDate: Date, entityName: TableModal, tx: TransactionInterface) {
        if (tx) {
            const sql = `
                INSERT INTO ${this.tableName} (lastRequestDate, entityName)
                VALUES (:lastRequestDate, :entityName)
            `;
            return await tx.queryNamed(sql, { lastRequestDate, entityName });
        } else {
            const sql = `
            INSERT INTO ${this.tableName} (lastRequestDate, entityName)
            VALUES (:lastRequestDate, :entityName)
        `;
            return await this.queryNamed(sql, { lastRequestDate, entityName });
        }
    }

    public async update(ebmSync: EbmSyncStatus) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE tin = :tin AND bhfId = :bhfId
        `;
        return await this.queryNamed(sql, ebmSync);
    }

    public async updateWithTransaction(ebmSync: EbmSyncStatus, entityName: TableModal, tx: TransactionInterface) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE tin = :tin AND bhfId = :bhfId AND entityName = :entityName
        `;
        if(tx) {
        return await tx.queryNamed(sql, {...ebmSync, entityName});
        }else{
            return await this.queryNamed(sql, {...ebmSync, entityName});
        }
    }

    public async updateWithTransactionByEntityName(lastRequestDate: Date, entityName: TableModal, tx: TransactionInterface) {
        const sql = `
            UPDATE ${this.tableName}
            SET lastRequestDate = :lastRequestDate
            WHERE entityName = :entityName`;
        return await tx.queryNamed(sql, { entityName, lastRequestDate });
    }
}
