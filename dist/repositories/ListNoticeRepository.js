"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNoticeRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const BaseRepository_1 = require("./BaseRepository");
class ListNoticeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.baseEbmSyncStatus = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
        this.tableName = 'list_notice';
    }
    async create(data, tx) {
        const sql = `INSERT INTO ${this.tableName} (tin, bhfId,noticeNo,title,cont,dtlUrl,regrNm,regDt) VALUES (:tin,:bhfId,:noticeNo,:title,:cont,:dtlUrl,:regrNm,:regDt)`;
        if (!tx) {
            const result = await this.queryNamed(sql, { ...data });
            return result.insertId;
        }
        else {
            const result = await tx.queryNamed(sql, { ...data });
            return result.insertId;
        }
    }
    async insertMany(data, payload) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncStatus.recordEbmSyncStatusWithTransaction(payload, "list_notice", tx);
            await Promise.all(data.map(async (item) => {
                item.tin = payload.tin;
                item.bhfId = payload.bhfId;
                await this.create(item, tx);
            }));
        });
        return true;
    }
    // get all 
    async getAll(payload) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { ...payload });
        return result;
    }
    async getOne(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE noticeNo = :id`;
        const result = await this.queryNamed(sql, { id });
        return result;
    }
}
exports.ListNoticeRepository = ListNoticeRepository;
