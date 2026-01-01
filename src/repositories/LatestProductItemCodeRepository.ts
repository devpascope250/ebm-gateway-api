import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { BaseRepository } from "./BaseRepository";

export class LatestProductItemCodeRepository extends BaseRepository {
    private readonly tableName = "items_list";
    async getAllProductItemCode(payload: EbmSyncStatus): Promise<Array<{ itemCd: string }>> {
        const sql = `SELECT DISTINCT itemCd FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId ORDER BY itemCd DESC`;
        const result = await this.queryNamed(sql, { ...payload});
        return result;
    }
    
}