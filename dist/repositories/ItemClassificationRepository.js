"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemClassificationRepository = void 0;
const EbmSyncStatusService_1 = require("../services/EbmSyncStatusService");
const BaseRepository_1 = require("./BaseRepository");
class ItemClassificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "item_classification";
        this.baseEbmSyncService = new (class extends EbmSyncStatusService_1.BaseEbmSyncService {
        })();
    }
    async findAll(query) {
        if (!query) {
            const sql = `SELECT * FROM ${this.tableName} LIMIT 20`;
            return await this.query(sql);
        }
        else {
            // Corrected SQL syntax
            const sql = `SELECT * FROM ${this.tableName} WHERE itemClsNm LIKE :query LIMIT 20`;
            return await this.queryNamed(sql, { query: `%${query}%` });
        }
    }
    // get by tin
    async findAllByTin(itemClsCd, tx) {
        if (!tx) {
            const sql = `SELECT * FROM ${this.tableName}  WHERE itemClsCd = :itemClsCd`;
            const result = await this.queryNamed(sql, { itemClsCd });
            return result ? result[0] : null;
        }
        else {
            const sql = `SELECT * FROM ${this.tableName}  WHERE itemClsCd = :itemClsCd`;
            const result = await tx.queryNamed(sql, { itemClsCd });
            return result ? result[0] : null;
        }
    }
    // create 
    async create(itemClass, tx) {
        const sql = `INSERT IGNORE INTO ${this.tableName} (itemClsCd,itemClsNm,itemClsLvl,taxTyCd,mjrTgYn,useYn) VALUES (:itemClsCd,:itemClsNm,:itemClsLvl,:taxTyCd,:mjrTgYn,:useYn)`;
        if (!tx) {
            const result = await this.queryNamed(sql, itemClass);
            return result.insertId;
        }
        else {
            const result = await tx.queryNamed(sql, itemClass);
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
    async createWithTransaction(itemClass, lastRequestDate) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransactionByEntityName(lastRequestDate, "item_classification", tx);
            // Process in manageable batches
            const batchSize = 500;
            for (let i = 0; i < itemClass.length; i += batchSize) {
                const batch = itemClass.slice(i, i + batchSize);
                await Promise.all(batch.map(item => this.create(item, tx).catch(err => {
                    // Log but don't throw - continue with other items
                    console.log(`Skipped duplicate: ${item.itemClsCd}`);
                    return null;
                })));
            }
        });
        return true;
    }
}
exports.ItemClassificationRepository = ItemClassificationRepository;
