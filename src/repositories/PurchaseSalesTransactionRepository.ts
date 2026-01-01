import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { PurchaseSalesTransaction, PurchaseSalesTransactionItem } from "../models/PurchaseSalesTransaction";
import { PurchaseSalesTransactionSave } from "../models/PurchaseSalesTransactionSave";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BATCHING_TYPE } from "../types/types";
import groupByMap from "../utils/DataParse";
import { DateUtils } from "../utils/date-time";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class PurchaseSalesTransactionRepository extends BaseRepository {
    private tableName = 'purchase_sales_transaction';
    private itemTableName = 'purchase_sales_transaction_item';
    private baseEbmSyncService: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();
    async findAll(): Promise<PurchaseSalesTransaction[]> {
        const sql = `SELECT * FROM  ${this.tableName}`;
        return await this.query<PurchaseSalesTransaction[]>(sql);
    }

    // create purchase sales transaction select

    async createPurchase(purchase: PurchaseSalesTransaction, tx?: TransactionInterface): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,spplrTin,spplrNm,spplrBhfId,spplrInvcNo,prcOrdCd,rcptTyCd,pmtTyCd,cfmDt,salesDt,stockRlsDt,totItemCnt,taxblAmtA,taxblAmtB,taxblAmtC,taxblAmtD,taxRtA,taxRtB,taxRtC,taxRtD,taxAmtA,taxAmtB,taxAmtC,taxAmtD,totTaxblAmt,totTaxAmt,totAmt,remark) VALUES (:tin,:bhfId,:spplrTin,:spplrNm,:spplrBhfId,:spplrInvcNo,:prcOrdCd,:rcptTyCd,:pmtTyCd,:cfmDt,:salesDt,:stockRlsDt,:totItemCnt,:taxblAmtA,:taxblAmtB,:taxblAmtC,:taxblAmtD,:taxRtA,:taxRtB,:taxRtC,:taxRtD,:taxAmtA,:taxAmtB,:taxAmtC,:taxAmtD,:totTaxblAmt,:totTaxAmt,:totAmt,:remark)`;
        // if prcOrdCd not exist in purchase
        if (!purchase.prcOrdCd) {
            purchase.prcOrdCd = null;
        }
        if (tx) {
            const result = await tx.queryNamed<{ insertId: number }>(sql, purchase);
            return result.insertId;
        } else {
            const result = await this.queryNamed<{ insertId: number }>(sql, purchase);
            return result.insertId;
        }
    }

    // create purchase Item
    async createPurchaseItem(purchaseItem: PurchaseSalesTransactionItem, tx?: TransactionInterface): Promise<number> {
        const sql = `INSERT INTO ${this.itemTableName} (purchaseSalesTransactionId,itemSeq,itemClsCd,itemCd,itemNm,bcd,pkgUnitCd,pkg,qtyUnitCd,qty,prc,splyAmt,dcRt,dcAmt,taxTyCd,taxblAmt,taxAmt,totAmt) VALUES (:purchaseSalesTransactionId,:itemSeq,:itemClsCd,:itemCd,:itemNm,:bcd,:pkgUnitCd,:pkg,:qtyUnitCd,:qty,:prc,:splyAmt,:dcRt,:dcAmt,:taxTyCd,:taxblAmt,:taxAmt,:totAmt)`;
        if (tx) {
            const result = await tx.queryNamed<{ insertId: number }>(sql, purchaseItem);
            return result.insertId;
        } else {
            const result = await this.queryNamed<{ insertId: number }>(sql, purchaseItem);
            return result.insertId;
        }
    }

    // update purchase

    async updatePurchaseItem(items: PurchaseSalesTransactionSave, id: number): Promise<boolean> {
        const sql = `UPDATE ${this.tableName} SET pchsSttsCd = :pchsSttsCd, regTyCd = :regTyCd WHERE id = :id`;
        await this.queryNamed(sql, { ...items, id });
        return true
    }

    // create all with transaction
    async createAll(purchase: PurchaseSalesTransaction[], payload: EbmSyncStatus): Promise<number> {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "purchase_sales_transaction", tx);
            if (purchase.length <= 5) {
                await Promise.all(purchase.map(async (purch) => {
                    purch.tin = payload.tin;
                    purch.bhfId = payload.bhfId;
                    const purchaseId = await this.createPurchase(purch, tx);
                    await this.createLists(purchaseId, purch.itemList, tx);

                }));
            } else if (purchase.length > 5 && purchase.length <= 10) {
                // Batch insert for purchase by 5
                for (let i = 0; i < purchase.length; i += BATCHING_TYPE.FIRST_BATCH_SIZE) {
                    const purchaseBatch = purchase.slice(i, i + BATCHING_TYPE.FIRST_BATCH_SIZE);
                    await Promise.all(purchaseBatch.map(async (purch) => {
                        purch.tin = payload.tin;
                        purch.bhfId = payload.bhfId;
                        const purchaseId = await this.createPurchase(purch, tx);
                        await this.createLists(purchaseId, purch.itemList, tx);
                    }));
                }

            } else {
                for (let i = 0; i < purchase.length; i += BATCHING_TYPE.LAST_BATCH_SIZE) {
                    const purchaseBatch = purchase.slice(i, i + BATCHING_TYPE.LAST_BATCH_SIZE);
                    for (const purch of purchaseBatch) {
                        purch.tin = payload.tin;
                        purch.bhfId = payload.bhfId;
                        const purchaseId = await this.createPurchase(purch, tx);
                        await this.createLists(purchaseId, purch.itemList, tx);
                    }
                }
            }
        });
        return 1;
    }

    async createLists(purchaseId: number, items?: PurchaseSalesTransactionItem[], tx?: TransactionInterface): Promise<number> {
        if (items) {
            if (items.length <= 5) {
                await Promise.all(items.map(async (item) => {
                    item.purchaseSalesTransactionId = purchaseId;
                    await this.createPurchaseItem(item, tx);
                }));
            } else if (items.length > 5 && items.length <= 15) {
                // Batch insert for items by 5
                for (let i = 0; i < items.length; i += BATCHING_TYPE.FIRST_BATCH_SIZE) {
                    const itemsBatch = items.slice(i, i + BATCHING_TYPE.FIRST_BATCH_SIZE);
                    await Promise.all(itemsBatch.map(async (item) => {
                        item.purchaseSalesTransactionId = purchaseId;
                        await this.createPurchaseItem(item, tx);
                    }));
                }
            } else {
                for (let i = 0; i < items.length; i += BATCHING_TYPE.LAST_BATCH_SIZE) {
                    const itemsBatch = items.slice(i, i + BATCHING_TYPE.LAST_BATCH_SIZE);
                    for (const item of itemsBatch) {
                        item.purchaseSalesTransactionId = purchaseId;
                        await this.createPurchaseItem(item, tx);
                    }
                }
            }
        }
        return 1;
    }

    // find by tin and bhfId join items
    async findByTinAndBhfId(tin: string, bhfId: string, startDate?: string, endDate?: string): Promise<PurchaseSalesTransaction[]> {
        // get to day date
        let start: Date;
        let end: Date;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();
        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        // const startCfmDt = DateUtils.format(start);
        // const endCfmDt = DateUtils.format(end);


        const sql = `
        SELECT 
        tra.*,
        item.id as item_id,
        item.purchaseSalesTransactionId as item_purchaseSalesTransactionId,
        item.itemSeq as item_itemSeq,
        item.itemClsCd as item_itemClsCd,
        item.itemCd as item_itemCd,
        item.itemNm as item_itemNm,
        item.bcd as item_bcd,
        item.pkgUnitCd as item_pkgUnitCd,
        item.pkg as item_pkg,
        item.qtyUnitCd as item_qtyUnitCd,
        item.qty as item_qty,
        item.prc as item_prc,
        item.splyAmt as item_splyAmt,
        item.dcRt as item_dcRt,
        item.dcAmt as item_dcAmt,
        item.taxTyCd as item_taxTyCd,
        item.taxblAmt as item_taxblAmt,
        item.taxAmt as item_taxAmt,
        item.totAmt as item_totAmt,
        item.createdAt as item_createdAt
        FROM ${this.tableName} tra
        LEFT JOIN ${this.itemTableName} item ON tra.id = item.purchaseSalesTransactionId
        WHERE tra.tin = :tin AND tra.bhfId = :bhfId AND tra.createdAt BETWEEN :start AND :end`;
        const purchases = await this.queryNamed(sql, { tin, bhfId, start, end });

        const data = groupByMap(purchases, (i: any) => i.item_purchaseSalesTransactionId);
        const nestedData = Array.from(data.entries()).map(([cdCls, items]) => {
            const firstItem = items[0];

            return {
                id: firstItem.id,
                tin: firstItem.tin,
                bhfId: firstItem.bhfId,
                spplrTin: firstItem.spplrTin,
                spplrNm: firstItem.spplrNm,
                spplrBhfId: firstItem.spplrBhfId,
                spplrInvcNo: firstItem.spplrInvcNo,
                prcOrdCd: firstItem.prcOrdCd,
                regTyCd: firstItem.regTyCd,
                pchsSttsCd: firstItem.pchsSttsCd,
                rcptTyCd: firstItem.rcptTyCd,
                pmtTyCd: firstItem.pmtTyCd,
                cfmDt: firstItem.cfmDt,
                salesDt: firstItem.salesDt,
                stockRlsDt: firstItem.stockRlsDt,
                totItemCnt: firstItem.totItemCnt,
                taxblAmtA: firstItem.taxblAmtA,
                taxblAmtB: firstItem.taxblAmtB,
                taxblAmtC: firstItem.taxblAmtC,
                taxblAmtD: firstItem.taxblAmtD,
                taxRtA: firstItem.taxRtA,
                taxRtB: firstItem.taxRtB,
                taxRtC: firstItem.taxRtC,
                taxRtD: firstItem.taxRtD,
                taxAmtA: firstItem.taxAmtA,
                taxAmtB: firstItem.taxAmtB,
                taxAmtC: firstItem.taxAmtC,
                taxAmtD: firstItem.taxAmtD,
                totTaxAmt: firstItem.totTaxAmt,
                totAmt: firstItem.totAmt,
                remark: firstItem.remark,
                createdAt: firstItem.createdAt,

                itemList: items.map((item) => {
                    return {
                        id: item.item_id,
                        purchaseSalesTransactionId: item.item_purchaseSalesTransactionId,
                        itemSeq: item.item_itemSeq,
                        itemClsCd: item.item_itemClsCd,
                        itemCd: item.item_itemCd,
                        itemNm: item.item_itemNm,
                        bcd: item.item_bcd,
                        pkgUnitCd: item.item_pkgUnitCd,
                        pkg: item.item_pkg,
                        qtyUnitCd: item.item_qtyUnitCd,
                        qty: item.item_qty,
                        prc: item.item_prc,
                        splyAmt: item.item_splyAmt,
                        dcRt: item.item_dcRt,
                        dcAmt: item.item_dcAmt,
                        taxTyCd: item.item_taxTyCd,
                        taxblAmt: item.item_taxblAmt,
                        taxAmt: item.item_taxAmt,
                        totAmt: item.item_totAmt,
                        createdAt: item.item_createdAt
                    }
                })
            }
        });
        return nestedData;
    }
}