import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { TransactionInterface } from "../repositories/BaseRepository";
import { EbmSyncStatusRepository } from "../repositories/EbmSyncStatusRepository";
import { TableModal } from "../types/types";
import { DateUtils } from "../utils/date-time";
import redisCache from "../utils/redisCache";
import { CacheNamespace } from "../types/cachesNameSpace";
export abstract class BaseEbmSyncService {
    protected repo: EbmSyncStatusRepository;

    constructor() {
        this.repo = new EbmSyncStatusRepository();
    }

    protected async recordEbmSyncStatus(ebmSync: EbmSyncStatus, entityName: TableModal): Promise<boolean> {
        const existing = await this.repo.findByTinAndBhfIdEntityName(ebmSync.tin, ebmSync.bhfId, entityName);
        if (existing) {
            await this.repo.update(ebmSync);
        } else {
            await this.repo.create(ebmSync);
        }
        return true;
    }

    // record Emb status with transaction
    async recordEbmSyncStatusWithTransaction(ebmSync: EbmSyncStatus, entityName: TableModal, tx: TransactionInterface): Promise<boolean> {
        const existing = await this.repo.findByTinAndBhfIdEntityWithTransaction(ebmSync, entityName, tx);
        const [namespace, key] = CacheNamespace.ebmSync.ebmSyncStatus(ebmSync.tin, ebmSync.bhfId, entityName);
        await redisCache.delete(namespace, key);
        if (existing) {
            await this.repo.updateWithTransaction(ebmSync, entityName, tx);
        } else {
            await this.repo.createWithTransaction(ebmSync, entityName, tx);
        }
        return true;
    }

    async recordEbmSyncStatusWithTransactionByEntityName(lastRequestDate: Date, entityName: TableModal, tx: TransactionInterface): Promise<boolean> {
        const [namespace, key] = CacheNamespace.ebmSync.ebmSyncByEntity(entityName);
        const existing = await this.repo.findByEntity(entityName, tx);
        if (existing) {
            await redisCache.delete(namespace, key);
            await this.repo.updateWithTransactionByEntityName(lastRequestDate, entityName, tx);
        } else {
            await redisCache.delete(namespace, key);
            await this.repo.createWithTransactionByEntityName(lastRequestDate, entityName, tx);
        }
        return true;

    }
    protected async getEbmSyncStatus(tin: string, bhfId: string, entityName: TableModal): Promise<EbmSyncStatus | null> {
        const [namespace, key] = CacheNamespace.ebmSync.ebmSyncStatus(tin, bhfId, entityName);
        const cache = await redisCache.get(namespace, key);
        if (cache) {
            return cache as EbmSyncStatus;
        }
        const result = await this.repo.findByTinAndBhfIdEntityName(tin, bhfId, entityName);
        await redisCache.save(namespace, key, result, { ttl: 86400 });
        return result;
    }

    protected async getEbmSyncStatusTinBhfIdEntityName(tin: string, bhfId: string, entityName: TableModal): Promise<EbmSyncStatus | null> {
        const [namespace, key] = CacheNamespace.ebmSync.ebmSyncStatus(tin, bhfId, entityName);
        // const cache = await redisCache.get(namespace, key);
        // if (cache) {
        //     return cache as EbmSyncStatus;
        // }
        const result = await this.repo.findByTinAndBhfIdEntityName(tin, bhfId, entityName);
        // await redisCache.save(namespace, key, result, { ttl: 86400 });
        return result;
    }
    protected async getEbmSyncStatusByEntityName(entityName: TableModal): Promise<EbmSyncStatus | null> {
        const [namespace, key] = CacheNamespace.ebmSync.ebmSyncByEntity(entityName);
        const cache = await redisCache.get(namespace, key);
        if (cache) {
            return cache as EbmSyncStatus;
        }
        const result = await this.repo.findByEntity(entityName);
        await redisCache.save(namespace, key, result, { ttl: 86400 });
        return result;
    }

    protected EbmRequestPayload(payload: EbmSyncStatus) {
        let dateToFormat = payload.lastRequestDate ? new Date(payload.lastRequestDate) : new Date();
        // dateToFormat.setHours(0, 0, 0, 0);
        return {
            tin: payload.tin,
            bhfId: payload.bhfId,
            lastReqDt: DateUtils.format(dateToFormat),
            clientId: payload.clientId
        }
    }
}
