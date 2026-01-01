import { SalesTransactionItem } from "../models/SalesTransaction";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class SalesTransactionItemsRepository extends BaseRepository {
    private tableName = 'sales_transactions_items';
    async create(saleTransactionItems: SalesTransactionItem, tx?: TransactionInterface) {
        const sql = `INSERT INTO ${this.tableName} (sales_transactions_id,itemSeq,itemClsCd,itemCd,itemNm,bcd,pkgUnitCd,pkg,qtyUnitCd,qty,prc,splyAmt,dcRt,dcAmt,isrccCd,isrccNm,isrcRt,isrcAmt,taxTyCd,taxblAmt,taxAmt,totAmt) VALUES (:sales_transactions_id,:itemSeq,:itemClsCd,:itemCd,:itemNm,:bcd,:pkgUnitCd,:pkg,:qtyUnitCd,:qty,:prc,:splyAmt,:dcRt,:dcAmt,:isrccCd,:isrccNm,:isrcRt,:isrcAmt,:taxTyCd,:taxblAmt,:taxAmt,:totAmt)`;
        if (tx) {
            const result = await tx.queryNamed(sql, saleTransactionItems);
            return result;
        } else {
            const result = await this.queryNamed(sql, saleTransactionItems);
            return result;
        }
    }
}