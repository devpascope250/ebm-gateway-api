import { SalesTransactionsReceipt } from "../models/SalesTransaction";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class SalesTransactionReceiptRepository extends BaseRepository {
    private tableName = 'sales_transactions_receipt';

    async create(saleTransactionReceipt: SalesTransactionsReceipt, tx?: TransactionInterface) {
        console.log();
        
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,custTIn,custMblNo,rptNo,trdeNm,adrs,topMsg,btmMsg,prchrAcptcYn) VALUES (:sales_transactions_id,:custTIn,:custMblNo,:rptNo,:trdeNm,:adrs,:topMsg,:btmMsg,:prchrAcptcYn)`;
        if (tx) {
            const result = await tx.queryNamed(sql, {...saleTransactionReceipt});
            return result;
        } else {
            const result = await this.queryNamed(sql, saleTransactionReceipt);
            return result;
        }
    }
}