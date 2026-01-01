"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveStockMasterRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SaveStockMasterRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'save_stock_master';
    }
    async create(masterStock) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,itemCd,rsdQty,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:itemCd,:rsdQty,:regrNm,:regrId,:modrNm,:modrId )`;
        const result = await this.queryNamed(sql, masterStock);
        return result.id;
    }
    async existedStockMaster(tin, bhfId, itemCd) {
        const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND itemCd = :itemCd`;
        const result = await this.queryNamed(sql, { tin, bhfId, itemCd });
        return result.count > 0;
    }
    async updateStockMaster(masterStock) {
        const sql = `UPDATE ${this.tableName} SET rsdQty = :rsdQty, modrNm = :modrNm, modrId = :modrId WHERE tin = :tin AND bhfId = :bhfId AND itemCd = :itemCd`;
        await this.queryNamed(sql, masterStock);
    }
    // create or update stock master
    async createOrUpdateStockMaster(masterStock) {
        const exists = await this.existedStockMaster(masterStock.tin, masterStock.bhfId, masterStock.itemCd);
        if (exists) {
            await this.updateStockMaster(masterStock);
        }
        else {
            await this.create(masterStock);
        }
    }
}
exports.SaveStockMasterRepository = SaveStockMasterRepository;
