"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerBranchInformationRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const BaseRepository_1 = require("./BaseRepository");
class TaxPayerBranchInformationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "tax_payer_branch_information";
        this.baseEbmSyncService = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
    }
    async create(branch, tx) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,bhfNm,bhfSttsCd,prvncNm,dstrtNm,sctrNm,locDesc,mgrNm,mgrTelNo,mgrEmail,hqYn) VALUES (:tin,:bhfId,:bhfNm,:bhfSttsCd,:prvncNm,:dstrtNm,:sctrNm,:locDesc,:mgrNm,:mgrTelNo,:mgrEmail,:hqYn)`;
        if (tx) {
            const result = await tx.queryNamed(sql, branch);
            return result.insertId;
        }
        else {
            const result = await this.queryNamed(sql, branch);
            return result.insertId;
        }
    }
    async createWithTransaction(branch, ebmSync) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(ebmSync, "tax_payer_branch_information", tx);
            await Promise.all(branch.map(async (branch) => {
                await this.create(branch, tx);
            }));
        });
        return true;
    }
    // get branch by tin
    async getBranchByTin(tin) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed(sql, { tin });
        return result;
    }
    async getBranchByTinByBhfId(tin, bhfId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId AND tin = :tin`;
        const result = await this.queryNamed(sql, { bhfId, tin });
        return result;
    }
    // get all 
    async getAll(payload) {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId AND tin = :tin`;
        const result = await this.queryNamed(sql, { ...payload });
        return result;
    }
}
exports.TaxPayerBranchInformationRepository = TaxPayerBranchInformationRepository;
