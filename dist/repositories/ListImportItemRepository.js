"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListImportItemRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const BaseRepository_1 = require("./BaseRepository");
class ListImportItemRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'list_import_item';
        this.baseEbmSyncService = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
    }
    async create(searchImportItem, tx) {
        const query = `INSERT INTO ${this.tableName} (tin,bhfId,taskCd,dclDe,itemSeq,dclNo,hsCd,itemNm,orgnNatCd,exptNatCd,pkg,pkgUnitCd,qty,qtyUnitCd,totWt,netWt,spplrNm,agntNm,invcFcurAmt,invcFcurCd,invcFcurExcrt) VALUES (:tin,:bhfId,:taskCd,:dclDe,:itemSeq,:dclNo,:hsCd,:itemNm,:orgnNatCd,:exptNatCd,:pkg,:pkgUnitCd,:qty,:qtyUnitCd,:totWt,:netWt,:spplrNm,:agntNm,:invcFcurAmt,:invcFcurCd,:invcFcurExcrt)`;
        if (tx) {
            const result = await tx.queryNamed(query, searchImportItem);
            return result.insertId;
        }
        else {
            const result = await this.queryNamed(query, searchImportItem);
            return result.insertId;
        }
    }
    // create many
    async createManyWithTransaction(listImportItems, payload) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "list_import_item", tx);
            await Promise.all(listImportItems.map(async (item) => {
                await this.create({ ...item, tin: payload.tin, bhfId: payload.bhfId }, tx);
            }));
        });
        return true;
    }
    // get all
    async getAll(payload) {
        const query = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId ORDER BY createdAt DESC`;
        const result = await this.queryNamed(query, { tin: payload.tin, bhfId: payload.bhfId });
        return result;
    }
}
exports.ListImportItemRepository = ListImportItemRepository;
