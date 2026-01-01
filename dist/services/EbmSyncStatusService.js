"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEbmSyncService = void 0;
const EbmSyncStatusRepository_1 = require("../repositories/EbmSyncStatusRepository");
const date_time_1 = require("../utils/date-time");
class BaseEbmSyncService {
    constructor() {
        this.repo = new EbmSyncStatusRepository_1.EbmSyncStatusRepository();
    }
    async recordEbmSyncStatus(ebmSync, entityName) {
        const existing = await this.repo.findByTinAndBhfIdEntityName(ebmSync.tin, ebmSync.bhfId, entityName);
        if (existing) {
            await this.repo.update(ebmSync);
        }
        else {
            await this.repo.create(ebmSync);
        }
        return true;
    }
    // record Emb status with transaction
    async recordEbmSyncStatusWithTransaction(ebmSync, entityName, tx) {
        const existing = await this.repo.findByTinAndBhfIdEntityWithTransaction(ebmSync, entityName, tx);
        if (existing) {
            await this.repo.updateWithTransaction(ebmSync, entityName, tx);
        }
        else {
            await this.repo.createWithTransaction(ebmSync, entityName, tx);
        }
        return true;
    }
    async recordEbmSyncStatusWithTransactionByEntityName(lastRequestDate, entityName, tx) {
        const existing = await this.repo.findByEntity(entityName, tx);
        if (existing) {
            await this.repo.updateWithTransactionByEntityName(lastRequestDate, entityName, tx);
        }
        else {
            await this.repo.createWithTransactionByEntityName(lastRequestDate, entityName, tx);
        }
        return true;
    }
    async getEbmSyncStatus(tin, bhfId, entityName) {
        return this.repo.findByTinAndBhfIdEntityName(tin, bhfId, entityName);
    }
    async getEbmSyncStatusTinBhfIdEntityName(tin, bhfId, entityName) {
        return this.repo.findByTinAndBhfIdEntityName(tin, bhfId, entityName);
    }
    async getEbmSyncStatusByEntityName(entityName) {
        return this.repo.findByEntity(entityName);
    }
    EbmRequestPayload(payload) {
        let dateToFormat = payload.lastRequestDate ? new Date(payload.lastRequestDate) : new Date();
        dateToFormat.setHours(0, 0, 0, 0);
        return {
            tin: payload.tin,
            bhfId: payload.bhfId,
            lastReqDt: date_time_1.DateUtils.format(dateToFormat),
            clientId: payload.clientId
        };
    }
}
exports.BaseEbmSyncService = BaseEbmSyncService;
