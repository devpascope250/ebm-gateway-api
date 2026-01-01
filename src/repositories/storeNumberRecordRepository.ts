import { StoreNumberRecord } from "../models/storeNumberRecord";
import { BaseRepository } from "./BaseRepository";

export class StoreNumberRecordRepository extends BaseRepository{
    private tableName = "store_number_record";
    
    // get next max sarNo
   async getNextSarNo(tin: string, bhfId: string): Promise<number> {
    const sql = `SELECT MAX(sarNo) as nextSarNo FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
    const result = await this.queryNamed<[{ nextSarNo: number }]>(sql, { tin, bhfId });
    return result[0].nextSarNo ? result[0].nextSarNo + 1 : 1;
}

    // create store number record
    async createStoreNumberRecord(tin: string, bhfId: string, sarNo: number): Promise<void> {
        const sql = `INSERT INTO ${this.tableName} (tin, bhfId, sarNo) VALUES (:tin, :bhfId, :sarNo)`;
        await this.queryNamed(sql, { tin, bhfId, sarNo });
    }

    //update store number record
    async updateStoreNumberRecord(tin: string, bhfId: string, sarNo: number): Promise<void> {
        const sql = `UPDATE ${this.tableName} SET sarNo = :sarNo WHERE tin = :tin AND bhfId = :bhfId`;
        await this.queryNamed(sql, { tin, bhfId, sarNo });
    }

    // check existed by tin, bhfId
    async checkExistedStoreNumberRecord(tin: string, bhfId: string): Promise<boolean> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed<StoreNumberRecord[]>(sql, { tin, bhfId });
        return result?.length ? true : false;
    }

}