"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesTransactionReceiptRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SalesTransactionReceiptRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'sales_transactions_receipt';
    }
    async create(saleTransactionReceipt, tx) {
        console.log();
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,custTIn,custMblNo,rptNo,trdeNm,adrs,topMsg,btmMsg,prchrAcptcYn) VALUES (:sales_transactions_id,:custTIn,:custMblNo,:rptNo,:trdeNm,:adrs,:topMsg,:btmMsg,:prchrAcptcYn)`;
        if (tx) {
            const result = await tx.queryNamed(sql, { ...saleTransactionReceipt });
            return result;
        }
        else {
            const result = await this.queryNamed(sql, saleTransactionReceipt);
            return result;
        }
    }
}
exports.SalesTransactionReceiptRepository = SalesTransactionReceiptRepository;
