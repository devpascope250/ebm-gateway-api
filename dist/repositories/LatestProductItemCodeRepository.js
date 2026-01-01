"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestProductItemCodeRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class LatestProductItemCodeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "items_list";
    }
    async getAllProductItemCode(payload) {
        const sql = `SELECT DISTINCT itemCd FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId ORDER BY itemCd DESC`;
        const result = await this.queryNamed(sql, { ...payload });
        return result;
    }
}
exports.LatestProductItemCodeRepository = LatestProductItemCodeRepository;
