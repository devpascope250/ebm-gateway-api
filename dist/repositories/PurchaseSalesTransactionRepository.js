"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSalesTransactionRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const DataParse_1 = __importDefault(require("../utils/DataParse"));
const BaseRepository_1 = require("./BaseRepository");
class PurchaseSalesTransactionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'purchase_sales_transaction';
        this.itemTableName = 'purchase_sales_transaction_item';
        this.baseEbmSyncService = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
    }
    async findAll() {
        const sql = `SELECT * FROM  ${this.tableName}`;
        return await this.query(sql);
    }
    // create purchase sales transaction select
    async createPurchase(purchase, tx) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,spplrTin,spplrNm,spplrBhfId,spplrInvcNo,prcOrdCd,rcptTyCd,pmtTyCd,cfmDt,salesDt,stockRlsDt,totItemCnt,taxblAmtA,taxblAmtB,taxblAmtC,taxblAmtD,taxRtA,taxRtB,taxRtC,taxRtD,taxAmtA,taxAmtB,taxAmtC,taxAmtD,totTaxblAmt,totTaxAmt,totAmt,remark) VALUES (:tin,:bhfId,:spplrTin,:spplrNm,:spplrBhfId,:spplrInvcNo,:prcOrdCd,:rcptTyCd,:pmtTyCd,:cfmDt,:salesDt,:stockRlsDt,:totItemCnt,:taxblAmtA,:taxblAmtB,:taxblAmtC,:taxblAmtD,:taxRtA,:taxRtB,:taxRtC,:taxRtD,:taxAmtA,:taxAmtB,:taxAmtC,:taxAmtD,:totTaxblAmt,:totTaxAmt,:totAmt,:remark)`;
        // if prcOrdCd not exist in purchase
        if (!purchase.prcOrdCd) {
            purchase.prcOrdCd = null;
        }
        if (tx) {
            const result = await tx.queryNamed(sql, purchase);
            console.log(result);
            return result.insertId;
        }
        else {
            const result = await this.queryNamed(sql, purchase);
            return result.insertId;
        }
    }
    // create purchase Item
    async createPurchaseItem(purchaseItem, tx) {
        const sql = `INSERT INTO ${this.itemTableName} (purchaseSalesTransactionId,itemSeq,itemClsCd,itemCd,itemNm,bcd,pkgUnitCd,pkg,qtyUnitCd,qty,prc,splyAmt,dcRt,dcAmt,taxTyCd,taxblAmt,taxAmt,totAmt) VALUES (:purchaseSalesTransactionId,:itemSeq,:itemClsCd,:itemCd,:itemNm,:bcd,:pkgUnitCd,:pkg,:qtyUnitCd,:qty,:prc,:splyAmt,:dcRt,:dcAmt,:taxTyCd,:taxblAmt,:taxAmt,:totAmt)`;
        if (tx) {
            const result = await tx.queryNamed(sql, purchaseItem);
            return result.insertId;
        }
        else {
            const result = await this.queryNamed(sql, purchaseItem);
            return result.insertId;
        }
    }
    // update purchase
    async updatePurchaseItem(items, id) {
        const sql = `UPDATE ${this.tableName} SET pchsSttsCd = :pchsSttsCd, regTyCd = :regTyCd WHERE id = :id`;
        await this.queryNamed(sql, { ...items, id });
        return true;
    }
    // create all with transaction
    async createAll(purchase, payload) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "purchase_sales_transaction", tx);
            if (purchase.length <= 5) {
                await Promise.all(purchase.map(async (purch) => {
                    purch.tin = payload.tin;
                    purch.bhfId = payload.bhfId;
                    const purchaseId = await this.createPurchase(purch, tx);
                    await this.createLists(purchaseId, purch.itemList, tx);
                }));
            }
            else if (purchase.length > 5 && purchase.length <= 10) {
                // Batch insert for purchase by 5
                for (let i = 0; i < purchase.length; i += 5 /* BATCHING_TYPE.FIRST_BATCH_SIZE */) {
                    const purchaseBatch = purchase.slice(i, i + 5 /* BATCHING_TYPE.FIRST_BATCH_SIZE */);
                    await Promise.all(purchaseBatch.map(async (purch) => {
                        purch.tin = payload.tin;
                        purch.bhfId = payload.bhfId;
                        const purchaseId = await this.createPurchase(purch, tx);
                        await this.createLists(purchaseId, purch.itemList, tx);
                    }));
                }
            }
            else {
                for (let i = 0; i < purchase.length; i += 50 /* BATCHING_TYPE.LAST_BATCH_SIZE */) {
                    const purchaseBatch = purchase.slice(i, i + 50 /* BATCHING_TYPE.LAST_BATCH_SIZE */);
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
    async createLists(purchaseId, items, tx) {
        if (items) {
            if (items.length <= 5) {
                await Promise.all(items.map(async (item) => {
                    item.purchaseSalesTransactionId = purchaseId;
                    await this.createPurchaseItem(item, tx);
                }));
            }
            else if (items.length > 5 && items.length <= 15) {
                // Batch insert for items by 5
                for (let i = 0; i < items.length; i += 5 /* BATCHING_TYPE.FIRST_BATCH_SIZE */) {
                    const itemsBatch = items.slice(i, i + 5 /* BATCHING_TYPE.FIRST_BATCH_SIZE */);
                    await Promise.all(itemsBatch.map(async (item) => {
                        item.purchaseSalesTransactionId = purchaseId;
                        await this.createPurchaseItem(item, tx);
                    }));
                }
            }
            else {
                for (let i = 0; i < items.length; i += 50 /* BATCHING_TYPE.LAST_BATCH_SIZE */) {
                    const itemsBatch = items.slice(i, i + 50 /* BATCHING_TYPE.LAST_BATCH_SIZE */);
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
    async findByTinAndBhfId(tin, bhfId) {
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
        WHERE tin = :tin AND bhfId = :bhfId`;
        const purchases = await this.queryNamed(sql, { tin, bhfId });
        const data = (0, DataParse_1.default)(purchases, (i) => i.item_purchaseSalesTransactionId);
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
                    };
                })
            };
        });
        return nestedData;
    }
}
exports.PurchaseSalesTransactionRepository = PurchaseSalesTransactionRepository;
