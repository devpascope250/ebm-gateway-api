"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveItemRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SaveItemRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'save_items';
    }
    async create(itemInformation) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,itemClsCd,itemCd,itemTyCd,itemNm,itemStdNm,orgnNatCd,pkgUnitCd,qtyUnitCd,taxTyCd,btchNo,bcd,dftPrc,grpPrcL1,grpPrcL2,grpPrcL3,grpPrcL4,grpPrcL5,addInfo,sftyQty,isrcAplcbYn,useYn,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:itemClsCd, :itemCd, :itemTyCd,:itemNm,:itemStdNm,:orgnNatCd,:pkgUnitCd,:qtyUnitCd,:taxTyCd,:btchNo,:bcd,:dftPrc,:grpPrcL1,:grpPrcL2,grpPrcL3,:grpPrcL4,grpPrcL5,:addInfo,:sftyQty,:isrcAplcbYn,:useYn,:regrNm,:regrId,:modrNm,:modrId)`;
        const result = await this.queryNamed(sql, itemInformation);
        return result.insertId;
    }
    async getAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.query(sql);
        return result;
    }
    // get by tin
    async geItemInformationByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin });
        return result;
    }
}
exports.SaveItemRepository = SaveItemRepository;
