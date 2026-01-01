import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ListNotice } from "../models/ListNotice";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class ListNoticeRepository extends BaseRepository {
    private baseEbmSyncStatus: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();
    private tableName = 'list_notice'

    async create(data: ListNotice, tx?: TransactionInterface): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin, bhfId,noticeNo,title,cont,dtlUrl,regrNm,regDt) VALUES (:tin,:bhfId,:noticeNo,:title,:cont,:dtlUrl,:regrNm,:regDt)`;
        if(!tx) {
        const result = await this.queryNamed<{ insertId: number }>(sql, {...data});
        return result.insertId;
        }else{
            const result = await tx.queryNamed<{ insertId: number }>(sql, {...data});
            return result.insertId;
        }
    }

    async insertMany(data: ListNotice[], payload: EbmSyncStatus): Promise<boolean> {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncStatus.recordEbmSyncStatusWithTransaction(payload, "list_notice", tx);
            await Promise.all(data.map(async (item) => {
                item.tin = payload.tin;
                item.bhfId = payload.bhfId;
                await this.create(item, tx);
            }))
        })

        return true;
    }

    // get all 

    async getAll(payload: EbmSyncStatus): Promise<ListNotice[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed<ListNotice[]>(sql, {...payload});       
        return result;

    }

    async getOne(id: number): Promise<ListNotice> {
        const sql = `SELECT * FROM ${this.tableName} WHERE noticeNo = :id`;
        const result = await this.queryNamed<ListNotice>(sql, { id });
        return result;
    }

}