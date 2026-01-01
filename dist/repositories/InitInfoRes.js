"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitInfoResRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class InitInfoResRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "init_info_res";
    }
    async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        return await this.query(sql);
    }
    async findOne(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = :id`;
        const result = await this.queryNamed(sql, { id });
        return result[0] || null;
    }
    // get all by tin
    async findAllByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        return await this.queryNamed(sql, [tin]);
    }
    // create new 
    async create(data) {
        const sql = `INSERT INTO ${this.tableName} 
        (tin,
        taxprNm,
        bsnsActv,
        bhfId,
        bhfNm,
        bhfOpenDt,
        prvncNm,
        dstrtNm,
        sctrNm,
        locDesc,
        hqYn,
        mgrNm,
        mgrTelNo,
        mgrEmail,
        sdcId,
        mrcNo,
        dvcId,
        intrlKey,
signKey,
cmcKey,
lastSaleInvcNo,
lastPchsInvcNo,
lastSaleRcptNo,
lastInvcNo,
lastTrainInvcNo,
lastProfrmInvcNo,
lastCopyInvcNo) VALUES (:tin,:taxprNm,:bsnsActv,:bhfId,:bhfNm,:bhfOpenDt,:prvncNm,:dstrtNm,:sctrNm,:locDesc,:hqYn,:mgrNm,:mgrTelNo,:mgrEmail,:sdcId,:mrcNo,:dvcId,:intrlKey,
:signKey,
:cmcKey,
:lastSaleInvcNo,
:lastPchsInvcNo,
:lastSaleRcptNo,
:lastInvcNo,
:lastTrainInvcNo,
:lastProfrmInvcNo,
:lastCopyInvcNo)`;
        await this.queryNamed(sql, data);
        return true;
    }
}
exports.InitInfoResRepository = InitInfoResRepository;
