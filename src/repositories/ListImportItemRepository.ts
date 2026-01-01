import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ListImportItem } from "../models/ListImportItem";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { DateUtils } from "../utils/date-time";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class ListImportItemRepository extends BaseRepository {
    private tableName = 'list_import_item';
    private baseEbmSyncService: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();

    async create(searchImportItem: ListImportItem, tx?: TransactionInterface): Promise<number> {
        const query = `INSERT INTO ${this.tableName} (tin,bhfId,taskCd,dclDe,itemSeq,dclNo,hsCd,itemNm,orgnNatCd,exptNatCd,pkg,pkgUnitCd,qty,qtyUnitCd,totWt,netWt,spplrNm,agntNm,invcFcurAmt,invcFcurCd,invcFcurExcrt) VALUES (:tin,:bhfId,:taskCd,:dclDe,:itemSeq,:dclNo,:hsCd,:itemNm,:orgnNatCd,:exptNatCd,:pkg,:pkgUnitCd,:qty,:qtyUnitCd,:totWt,:netWt,:spplrNm,:agntNm,:invcFcurAmt,:invcFcurCd,:invcFcurExcrt)`;
        if (tx) {
            const result = await tx.queryNamed(query, searchImportItem);
            return result.insertId;
        } else {
            const result = await this.queryNamed(query, searchImportItem);
            return result.insertId;
        }
    }


    // create many
    async createManyWithTransaction(listImportItems: ListImportItem[], payload: EbmSyncStatus): Promise<boolean> {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "list_import_item", tx);
            await Promise.all(listImportItems.map(async (item) => {
                await this.create({ ...item, tin: payload.tin, bhfId: payload.bhfId }, tx);
            }))
        })
        return true;
    }
    // get all

    async getAll(payload: EbmSyncStatus, startDate?: string, endDate?: string): Promise<ListImportItem[]> {
        // get to day date
        let start: Date;
        let end: Date;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();

        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        // const startDclDe = DateUtils.format(start);
        // const endDclDe = DateUtils.format(end);
        const query = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND createdAt BETWEEN :start AND :end ORDER BY createdAt DESC`;
        const result = await this.queryNamed<ListImportItem[]>(query, { tin: payload.tin, bhfId: payload.bhfId, start, end });
        return result;
    }
}