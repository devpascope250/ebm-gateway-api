"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchInsuranceRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class BranchInsuranceRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'branch_insurance';
    }
    // create branch insurance
    async create(insurance) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,isrccCd,isrccNm,isrcRt,useYn,regrNm,regrId,modrNm) VALUES (:tin,:bhfId,:isrccCd,:isrccNm,:isrcRt,:useYn,:regrNm,:regrId,:modrNm)`;
        const result = await this.queryNamed(sql, insurance);
        return result.insertId;
    }
    // get all insurances
    async getAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.query(sql);
        return result;
    }
    // get insurance by id
    async getByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin });
        return result[0];
    }
}
exports.BranchInsuranceRepository = BranchInsuranceRepository;
