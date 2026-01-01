"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchCustomerRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class BranchCustomerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'branch_customer';
    }
    async create(branchCustomer) {
        const query = `INSERT INTO ${this.tableName} (tin,bhfId,custNo,custTin,custNm,adrs,telNo,email,faxNo,useYn,remark,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:custNo,:custTin,:custNm,:adrs,:telNo,:email,:faxNo,:useYn,:remark,:regrNm,:regrId,:modrNm,:modrId)`;
        const result = await this.queryNamed(query, branchCustomer);
        return result.insertId;
    }
    // get branch by tin
    async getBranchCustomerByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin });
        return result;
    }
    async getBranchCustomerByBhfId(bhfId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { bhfId });
        return result;
    }
    // get branch by custNo
    async getBranchCustomerByCustNo(custNo) {
        const sql = `SELECT * FROM ${this.tableName} WHERE custNo = :custNo`;
        const result = await this.queryNamed(sql, { custNo });
        return result;
    }
    // get all
    async getAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.queryNamed(sql);
        return result;
    }
}
exports.BranchCustomerRepository = BranchCustomerRepository;
