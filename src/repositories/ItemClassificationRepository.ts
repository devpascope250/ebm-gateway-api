import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ItemClassification } from "../models/ItemClassification";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BaseRepository, TransactionInterface } from "./BaseRepository";
export class ItemClassificationRepository extends BaseRepository {
    private tableName = "item_classification";
    private baseEbmSyncService: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();
  async findAll(query?: string): Promise<ItemClassification[]> {
    if (!query) {
        const sql = `SELECT * FROM ${this.tableName} LIMIT 20`;
        return await this.query<ItemClassification[]>(sql);
    } else {
        // Corrected SQL syntax
        const sql = `SELECT * FROM ${this.tableName} WHERE itemClsNm LIKE :query LIMIT 20`;
        return await this.queryNamed<ItemClassification[]>(sql, { query: `%${query}%` });
    }
}
    // get by tin
    async findAllByTin(itemClsCd: string, tx?: TransactionInterface): Promise<ItemClassification | null> {
        if (!tx) {
            const sql = `SELECT * FROM ${this.tableName}  WHERE itemClsCd = :itemClsCd`;
            const result = await this.queryNamed<ItemClassification[]>(sql, { itemClsCd });
            return result ? result[0] : null;
        } else {
            const sql = `SELECT * FROM ${this.tableName}  WHERE itemClsCd = :itemClsCd`;
            const result = await tx.queryNamed<ItemClassification[]>(sql, { itemClsCd });
            return result ? result[0] : null;
        }

    }
    // create 

async create(itemClass: ItemClassification, tx?: TransactionInterface): Promise<number> {
    const sql = `INSERT IGNORE INTO ${this.tableName} (itemClsCd,itemClsNm,itemClsLvl,taxTyCd,mjrTgYn,useYn) VALUES (:itemClsCd,:itemClsNm,:itemClsLvl,:taxTyCd,:mjrTgYn,:useYn)`;
    if (!tx) {
        const result = await this.queryNamed<{ insertId: number }>(sql, itemClass);
        return result.insertId;
    } else {
        const result = await tx.queryNamed<{ insertId: number }>(sql, itemClass);
        return result.insertId;
    }
}

    // create with transactions
    // async createWithTransaction(itemClass: ItemClassification[], lastRequestDate: Date): Promise<boolean> {
    //     await this.transaction(async (tx) => {
    //         await this.baseEbmSyncService.recordEbmSyncStatusWithTransactionByEntityName(lastRequestDate, "item_classification", tx)
    //         await Promise.all(itemClass.map(async (item) => {
    //                 await this.create(item, tx);
    //         }))
    //     })
    //     return true
    // }

    async createWithTransaction(itemClass: ItemClassification[], lastRequestDate: Date): Promise<boolean> {
    await this.transaction(async (tx) => {
        await this.baseEbmSyncService.recordEbmSyncStatusWithTransactionByEntityName(lastRequestDate, "item_classification", tx);
        // Process in manageable batches
        const batchSize = 500;
        for (let i = 0; i < itemClass.length; i += batchSize) {
            const batch = itemClass.slice(i, i + batchSize);
            
            await Promise.all(
                batch.map(item => this.create(item, tx).catch(err => {
                    // Log but don't throw - continue with other items
                    console.log(`Skipped duplicate: ${item.itemClsCd}`);
                    return null;
                }))
            );
        }
    });
    return true;
}
}