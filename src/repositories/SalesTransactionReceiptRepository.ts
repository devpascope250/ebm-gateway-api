import { SalesTransactionsReceipt } from "../models/SalesTransaction";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class SalesTransactionReceiptRepository extends BaseRepository {
    private tableName = 'sales_transactions_receipt';

    async create(saleTransactionReceipt: SalesTransactionsReceipt, tx?: TransactionInterface) {
        const NewSave: SalesTransactionsReceipt = {
            custTin: saleTransactionReceipt.custTIn ?? saleTransactionReceipt.custTin,
            custMblNo: saleTransactionReceipt.custMblNo,
            rptNo: saleTransactionReceipt.rptNo,
            trdeNm: saleTransactionReceipt.trdeNm,
            adrs: saleTransactionReceipt.adrs,
            topMsg: saleTransactionReceipt.topMsg,
            btmMsg: saleTransactionReceipt.btmMsg,
            prchrAcptcYn: saleTransactionReceipt.prchrAcptcYn,
            sales_transactions_id: saleTransactionReceipt.sales_transactions_id
        };

        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,custTin,custMblNo,rptNo,trdeNm,adrs,topMsg,btmMsg,prchrAcptcYn) VALUES (:sales_transactions_id,:custTin,:custMblNo,:rptNo,:trdeNm,:adrs,:topMsg,:btmMsg,:prchrAcptcYn)`;
        if (tx) {
            const result = await tx.queryNamed(sql, { ...NewSave });
            return result;
        } else {
            const result = await this.queryNamed(sql, NewSave);
            return result;
        }
    }
}