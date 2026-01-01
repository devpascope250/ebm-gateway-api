"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsListRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const BaseRepository_1 = require("./BaseRepository");
class ItemsListRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "items_list";
        this.baseEbmSyncService = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
        // fer
    }
    //create items
    async create(item, tx) {
        const query = `INSERT IGNORE INTO ${this.tableName} (tin,itemClsCd,itemCd,itemTyCd,itemNm,itemStdNm,orgnNatCd,pkgUnitCd,qtyUnitCd,taxTyCd,btchNo,regBhfId,bcd,dftPrc,grpPrcL1,grpPrcL2,grpPrcL3,grpPrcL4,grpPrcL5,addInfo,sftyQty,isrcAplcbYn,rraModYn,useYn) VALUES (:tin,:itemClsCd,:itemCd,:itemTyCd,:itemNm,:itemStdNm,:orgnNatCd,:pkgUnitCd,:qtyUnitCd,:taxTyCd,:btchNo,:regBhfId,:bcd,:dftPrc,:grpPrcL1,:grpPrcL2,:grpPrcL3,:grpPrcL4,:grpPrcL5,:addInfo,:sftyQty,:isrcAplcbYn,:rraModYn,:useYn)`;
        if (tx) {
            const result = await tx.queryNamed(query, { ...item });
            return result.id;
        }
        else {
            const result = await this.queryNamed(query, { ...item });
            return result.id;
        }
    }
    async update(item, tx) {
        const query = `UPDATE ${this.tableName} SET tin = :tin,itemClsCd = :itemClsCd,itemCd = :itemCd,itemTyCd = :itemTyCd,itemNm = :itemNm,itemStdNm = :itemStdNm,orgnNatCd = :orgnNatCd,pkgUnitCd = :pkgUnitCd,qtyUnitCd = :qtyUnitCd,taxTyCd = :taxTyCd,btchNo = :btchNo,regBhfId = :regBhfId,bcd = :bcd,dftPrc = :dftPrc,grpPrcL1 = :grpPrcL1,grpPrcL2 = :grpPrcL2,grpPrcL3 = :grpPrcL3,grpPrcL4 = :grpPrcL4,grpPrcL5 = :grpPrcL5,addInfo = :addInfo,sftyQty = :sftyQty,isrcAplcbYn = :isrcAplcbYn,rraModYn = :rraModYn,useYn = :useYn WHERE tin = :tin AND regBhfId = :regBhfId AND itemCd = :itemCd`;
        if (tx) {
            const result = await tx.queryNamed(query, { ...item });
            return result;
        }
        else {
            const result = await this.queryNamed(query, { ...item });
            return result;
        }
    }
    async checkExistedItem(itemCd, payload, tx) {
        const sql = `SELECT * FROM ${this.tableName} WHERE itemCd = :itemCd AND tin = :tin AND regBhfId = :bhfId`;
        if (tx) {
            const result = await tx.queryNamed(sql, { itemCd, ...payload });
            return (result && result.length > 0) ? true : false;
        }
        else {
            const result = await this.queryNamed(sql, { itemCd, ...payload });
            return (result && result.length > 0) ? true : false;
        }
    }
    async createManyItems(items, payload) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "items_list", tx);
            await Promise.all(items.map(async (item) => {
                const existed = await this.checkExistedItem(item.itemCd ?? "", payload, tx);
                if (existed) {
                    await this.update(item, tx);
                }
                else {
                    await this.create(item, tx);
                }
            }));
        });
    }
    async getAll(payload) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId`;
        const result = await this.queryNamed(sql, { ...payload });
        return result;
    }
    // get items by tin
    async getByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin });
        return result;
    }
    // get items by bhfId
    async getByBhfId(bhfId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { bhfId });
        return result;
    }
    // get items by tin and itemClsCd
    async getByTinBhfIdAndItemCd(tin, bhfId, itemCd) {
        if (Array.isArray(itemCd)) {
            const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId AND itemCd IN (:itemCd)`;
            const result = await this.queryNamedWithArrays(sql, { tin, bhfId, itemCd: itemCd.map(item => item.itemCd) });
            return result;
        }
        else {
            const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId AND itemCd = :itemCd`;
            const result = await this.queryNamed(sql, { tin, bhfId, itemCd });
            return result;
        }
    }
    // get items by tin and itemClsCd and itemCd
    async getByTinAndItemClsCdAndItemCd(tin, itemClsCd, itemCd) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND itemClsCd = :itemClsCd AND itemCd = :itemCd`;
        const result = await this.queryNamed(sql, { tin, itemClsCd, itemCd });
        return result;
    }
}
exports.ItemsListRepository = ItemsListRepository;
