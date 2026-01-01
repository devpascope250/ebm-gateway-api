"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesTransactionResponseRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SalesTransactionResponseRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'sales_transactions_response';
    }
    async create(saleTransactionResponse, tx) {
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,rcptNo,intrlData, rcptSign, totRcptNo, vsdcRcptPbctDate, sdcId, mrcNo) VALUES (:sales_transactions_id, :rcptNo, :intrlData, :rcptSign, :totRcptNo, :vsdcRcptPbctDate, :sdcId, :mrcNo)`;
        if (tx) {
            const result = await tx.queryNamed(sql, saleTransactionResponse);
            return result;
        }
        else {
            const result = await this.queryNamed(sql, saleTransactionResponse);
            return result;
        }
    }
}
exports.SalesTransactionResponseRepository = SalesTransactionResponseRepository;
