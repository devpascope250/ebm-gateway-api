import { SalesTransactionResponse } from "../models/SalesTransaction";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class SalesTransactionResponseRepository extends BaseRepository {
    private tableName = 'sales_transactions_response';

    async create(saleTransactionResponse: SalesTransactionResponse, tx?: TransactionInterface) {
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,rcptNo,intrlData, rcptSign, totRcptNo, vsdcRcptPbctDate, sdcId, mrcNo) VALUES (:sales_transactions_id, :rcptNo, :intrlData, :rcptSign, :totRcptNo, :vsdcRcptPbctDate, :sdcId, :mrcNo)`;
        if (tx) {
            const result = await tx.queryNamed(sql, saleTransactionResponse);
            return result;
        } else {
            const result = await this.queryNamed(sql, saleTransactionResponse);
            return result;
        }

    }

}