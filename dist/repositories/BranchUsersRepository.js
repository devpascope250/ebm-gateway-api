"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchUsersRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class BranchUsersRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tabName = 'branch_users';
    }
    // create new user
    async create(user) {
        const sql = `INSERT INTO ${this.tabName} (tin,bhfId,userId,userNm,pwd,adrs,cntc,authCd,remark,useYn,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:userId,:userNm,:pwd,:adrs,:cntc,:authCd,:remark,:useYn,:regrNm,:regrId,:modrNm,modrId)`;
        const result = await this.queryNamed(sql, user);
        return result.insertId;
    }
    async getBranchUsersByBhId(branchId) {
        const sql = `SELECT * FROM ${this.tabName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { bhfId: branchId });
        return result;
    }
    // gett user by tin
    async getBranchUsersByTin(tin) {
        const sql = `SELECT * FROM ${this.tabName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin: tin });
        return result;
    }
    // get all
    async getAll() {
        const sql = `SELECT * FROM ${this.tabName}`;
        const result = await this.queryNamed(sql);
        return result;
    }
    // get user by userId
    async getBranchUsersByUserId(userId) {
        const sql = `SELECT * FROM ${this.tabName} WHERE userId = :userId`;
        const result = await this.queryNamed(sql, { userId });
        return result[0] || null;
    }
}
exports.BranchUsersRepository = BranchUsersRepository;
