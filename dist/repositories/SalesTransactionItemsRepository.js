"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesTransactionItemsRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class SalesTransactionItemsRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'sales_transactions_items';
    }
    async create(saleTransactionItems, tx) {
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,itemSeq,itemClsCd,itemCd,itemNm,bcd,pkgUnitCd,pkg,qtyUnitCd,qty,prc,splyAmt,dcRt,dcAmt,isrccCd,isrccNm,isrcRt,isrcAmt,taxTyCd,taxblAmt,taxAmt,totAmt) VALUES (:sales_transactions_id,:itemSeq,:itemClsCd,:itemCd,:itemNm,:bcd,:pkgUnitCd,:pkg,:qtyUnitCd,:qty,:prc,:splyAmt,:dcRt,:dcAmt,:isrccCd,:isrccNm,:isrcRt,:isrcAmt,:taxTyCd,:taxblAmt,:taxAmt,:totAmt)`;
        if (tx) {
            const result = await tx.queryNamed(sql, saleTransactionItems);
            return result;
        }
        else {
            const result = await this.queryNamed(sql, saleTransactionItems);
            return result;
        }
    }
}
exports.SalesTransactionItemsRepository = SalesTransactionItemsRepository;
