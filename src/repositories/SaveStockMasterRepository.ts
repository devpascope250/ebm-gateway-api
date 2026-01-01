import { SaveStockMaster } from "../models/SaveStockMaster";
import { BaseRepository } from "./BaseRepository";

export class SaveStockMasterRepository extends BaseRepository {

    private tableName = 'save_stock_master';

    async create(masterStock: SaveStockMaster): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,itemCd,rsdQty,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:itemCd,:rsdQty,:regrNm,:regrId,:modrNm,:modrId )`;
        const result = await this.queryNamed<{ id: number }>(sql, masterStock);
        return result.id;
    }

    async existedStockMaster(tin: string, bhfId: string, itemCd: string): Promise<boolean> {
        const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND itemCd = :itemCd`;
        const result = await this.queryNamed<[{ count: number }]>(sql, { tin, bhfId, itemCd });
        return result? result[0].count > 0 : false;
    }

    async updateStockMaster(masterStock: SaveStockMaster): Promise<void> {
        const sql = `UPDATE ${this.tableName} SET rsdQty = :rsdQty, modrNm = :modrNm, modrId = :modrId WHERE tin = :tin AND bhfId = :bhfId AND itemCd = :itemCd`;
        await this.queryNamed(sql, masterStock);
    }

    // create or update stock master
    async createOrUpdateStockMaster(masterStock: SaveStockMaster): Promise<void> {
        const exists = await this.existedStockMaster(masterStock.tin, masterStock.bhfId, masterStock.itemCd);
        console.log(masterStock.tin, masterStock.bhfId, masterStock.itemCd);
        
        if (exists) {
            await this.updateStockMaster(masterStock);
        } else {
            await this.create(masterStock);
        }
    }

    // find all by tin and bhfId
    async findAllByTinBhfId(tin: string, bhfId: string): Promise<SaveStockMaster[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed<SaveStockMaster[]>(sql, { tin, bhfId });
        return result;
    }

    // find by tin, bhfId, itemCd
    async findByTinBhfIdItemCd(tin: string, bhfId: string, itemCd: string): Promise<SaveStockMaster | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND itemCd = :itemCd`;
        const result = await this.queryNamed<SaveStockMaster[]>(sql, { tin, bhfId, itemCd });
        return result.length > 0 ? result[0] : null;
    }
}