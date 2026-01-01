import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ListStockMovement, ListStockMovementItem } from "../models/ListStockMovement";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BATCHING_TYPE } from "../types/types";
import groupByMap from "../utils/DataParse";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class ListStockMovementRepository extends BaseRepository {
    private tableName = 'list_stock_movement';
    private tableItemName = 'list_stock_movement_item';
    private baseEbmSyncService: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();
    protected async create(movement: ListStockMovement, tx: TransactionInterface): Promise<number> {
        const query = `INSERT INT ${this.tableName} (custTin,custBhfId,sarNo,ocrnDt,totItemCnt,totTaxblAmt,totTaxAmt,totAmt,remark) VALUES (:custTin,:custBhfId,:sarNo,:ocrnDt,:totItemCnt,:totTaxblAmt,:totTaxAmt,:totAmt,:remark)`;

        const result = await tx.queryNamed<{ id: number }>(query, movement);
        return result.id;
    }

    async createManyStockMovements(movements: ListStockMovement[], payload: EbmSyncStatus): Promise<void> {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "list_stock_movement", tx);
            if (movements.length === 0) return;
            if (movements.length <= 5) {
                await Promise.all(movements.map(async (movement) => {
                    const stockMovementId = await this.create(movement, tx);
                    if (movement.itemList && movement.itemList.length > 0) {
                        await this.createManyItems(movement.itemList, stockMovementId, tx);
                    }
                }));
            } else if (movements.length <= 10) {
                for (let i = 0; i < movements.length; i += BATCHING_TYPE.FIRST_BATCH_SIZE) {
                    const batch = movements.slice(i, i + BATCHING_TYPE.FIRST_BATCH_SIZE);
                    await Promise.all(batch.map(async (movement) => {
                        const stockMovementId = await this.create(movement, tx);
                        if (movement.itemList && movement.itemList.length > 0) {
                            await this.createManyItems(movement.itemList, stockMovementId, tx);
                        }
                    }));
                }
            } else if (movements.length <= 20) {
                for (let i = 0; i < movements.length; i += BATCHING_TYPE.SECOND_BATCH_SIZE) {
                    const batch = movements.slice(i, i + BATCHING_TYPE.SECOND_BATCH_SIZE);
                    for (const movement of batch) {
                        const stockMovementId = await this.create(movement, tx);
                        if (movement.itemList && movement.itemList.length > 0) {
                            await this.createManyItems(movement.itemList, stockMovementId, tx);
                        }
                    }
                }
            } else {
                for (let i = 0; i < movements.length; i += BATCHING_TYPE.LAST_BATCH_SIZE) {
                    const batch = movements.slice(i, i + BATCHING_TYPE.LAST_BATCH_SIZE);
                    for (const movement of batch) {
                        const stockMovementId = await this.create(movement, tx);
                        if (movement.itemList && movement.itemList.length > 0) {
                            await this.createManyItems(movement.itemList, stockMovementId, tx);
                        }
                    }
                }
            }
        });
    }

    // create items
    protected async createItems(items: ListStockMovementItem, tx?: TransactionInterface): Promise<number> {
        const query = `INSERT INTO ${this.tableItemName} (stockMovementId,itemSeq,itemClsCd,itemCd,itemNm,bcd,pkgUnitCd,pkg,qtyUnitCd,qty,itemExprDt,prc,splyAmt,totDcAmt,taxblAmt,taxTyCd,taxAmt) VALUES (:stockMovementId,:itemSeq,:itemClsCd,:itemCd,:itemNm,:bcd,:pkgUnitCd,:pkg,:qtyUnitCd,:qty,:itemExprDt,:prc,:splyAmt,:totDcAmt,:taxblAmt,:taxTyCd,:taxAmt)`;
        if (tx) {
            const result = await tx.queryNamed<{ id: number }>(query, items);
            return result.id;
        } else {
            const result = await this.queryNamed<{ id: number }>(query, items);
            return result.id;
        }
    }

    // create many items
    protected async createManyItems(items: ListStockMovementItem[], stockMovementId: number, tx: TransactionInterface): Promise<void> {
        if (items.length === 0) return;
        if (items.length <= 5) {
            await Promise.all(items.map(async (item) => {
                item.stockMovementId = stockMovementId;
                await this.createItems(item, tx);
            }));
        } else if (items.length <= 10) {
            for (let i = 0; i < items.length; i += BATCHING_TYPE.FIRST_BATCH_SIZE) {
                const batch = items.slice(i, i + BATCHING_TYPE.FIRST_BATCH_SIZE);
                await Promise.all(batch.map(async (item) => {
                    item.stockMovementId = stockMovementId;
                    await this.createItems(item, tx);
                }));
            }
        } else if (items.length <= 20) {
            for (let i = 0; i < items.length; i += BATCHING_TYPE.SECOND_BATCH_SIZE) {
                const batch = items.slice(i, i + BATCHING_TYPE.SECOND_BATCH_SIZE);
                for (const item of batch) {
                    item.stockMovementId = stockMovementId;
                    await this.createItems(item, tx);
                }
            }
        } else {
            for (let i = 0; i < items.length; i += BATCHING_TYPE.LAST_BATCH_SIZE) {
                const batch = items.slice(i, i + BATCHING_TYPE.LAST_BATCH_SIZE);
                for (const item of batch) {
                    item.stockMovementId = stockMovementId;
                    await this.createItems(item, tx);
                }
            }
        }
    }
    // get all 

    // id?: number;  // auto increment
    // tin?: string;
    // bhfId?: string;
    // custTin?: string;
    // custBhfId?: string;
    // sarNo?: number;
    // ocrnDt?: string;
    // totItemCnt?: number;
    // totTaxblAmt?: number;
    // totTaxAmt?: number;
    // totAmt?: number;
    // remark?: string;
    // createdAt?: Date;
    // itemList?: ListStockMovementItem[];


    // stockMovementId?: number; // Stock Movement Id
    // itemSeq?: number;
    // itemClsCd?: string;
    // itemCd?: string;
    // itemNm?: string;
    // bcd?: string;
    // pkgUnitCd?: string;
    // pkg?: number;
    // qtyUnitCd?: string;
    // qty?: number;
    // itemExprDt?: string;
    // prc?: number;
    // splyAmt?: number;
    // totDcAmt?: number;
    // taxblAmt?: number;
    // taxTyCd?: string;
    // taxAmt?: number;
    // totAmt?: number;
    async findAll(payload: EbmSyncStatus, start_date?: string, end_date?: string) {
                
         let start: Date;
        let end: Date;
        if (start_date && end_date) {
            start = new Date(start_date);
            end = new Date(end_date);
        } else {
            start = new Date();
            end = new Date();
        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

const query = `
    SELECT 
    st.*,
    ite.stockMovementId as detail_stockMovementId,
    ite.itemSeq as detail_item_seq,
    ite.itemClsCd as detail_itemClsCd,
    ite.itemCd as detail_itemCd,
    ite.itemNm as detail_itemNm,
    ite.bcd as detail_bcd,
    ite.pkgUnitCd as detail_pkgUnitCd,
    ite.pkg as detail_pkg,
    ite.qtyUnitCd as detail_qtyUnitCd,
    ite.qty as detail_qty,
    ite.itemExprDt as detail_itemExprDt,
    ite.prc as detail_prc,
    ite.splyAmt as detail_splyAmt,
    ite.totDcAmt as detail_totDcAmt,
    ite.taxblAmt as detail_taxblAmt,
    ite.taxTyCd as detail_taxTyCd,
    ite.taxAmt as detail_taxAmt,
    ite.totAmt as detail_totAmt
    FROM ${this.tableName} st 
    LEFT JOIN ${this.tableItemName} ite ON st.id = ite.stockMovementId
    WHERE st.tin = :tin 
    AND st.bhfId = :bhfId 
    AND st.createdAt BETWEEN :start AND :end`;
        const result = await this.queryNamed(query, { ...payload, start, end });

        // const data = groupByMap(result, (i: any) => i.detail_stockMovementId);
        //         const nestedData = Array.from(data.entries()).map(([cdCls, items]) => {

        //             const firstItem = items[0];

        //             return {
        //                 id: firstItem.id,
        //                 tin: firstItem.tin,
        //                 bhfId: firstItem.bhfId,
        //                 custTin: firstItem.custTin,
        //                 custBhfId: firstItem.custBhfId,
        //                 sarNo: firstItem.sarNo,
        //                 ocrnDt: firstItem.ocrnDt,
        //                 totItemCnt: firstItem.totItemCnt,
        //                 totTaxblAmt: firstItem.totTaxblAmt,
        //                 totTaxAmt: firstItem.totTaxAmt,
        //                 totAmt: firstItem.totAmt,
        //                 remark: firstItem.remark,
        //                 createdAt: firstItem.createdAt,
        //                 itemList: items.map((item) => {
        //                     return {
        //                         stockMovementId: item.detail_stockMovementId,
        //                         itemSeq: item.detail_item_seq,
        //                         itemClsCd: item.detail_itemClsCd,
        //                         itemCd: item.detail_itemCd,
        //                         itemNm: item.detail_itemNm,
        //                         bcd: item.detail_bcd,
        //                         pkgUnitCd: item.detail_pkgUnitCd,
        //                         pkg: item.detail_pkg,
        //                         qtyUnitCd: item.detail_qtyUnitCd,
        //                         qty: item.detail_qty,
        //                         itemExprDt: item.detail_itemExprDt,
        //                         prc: item.detail_prc,
        //                         splyAmt: item.detail_splyAmt,
        //                         totDcAmt: item.detail_totDcAmt,
        //                         taxblAmt: item.detail_taxblAmt,
        //                         taxTyCd: item.detail_taxTyCd,
        //                         taxAmt: item.detail_taxAmt,
        //                         totAmt: item.detail_totAmt,

        //                     }
        //                 })
        //             }
        //         });

        return result;
}
}