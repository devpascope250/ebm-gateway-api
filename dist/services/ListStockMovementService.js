"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStockMovementService = void 0;
const ListStockMovementRepository_1 = require("../repositories/ListStockMovementRepository");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class ListStockMovementService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.listStockMovementRepository = new ListStockMovementRepository_1.ListStockMovementRepository();
    }
    async fetchStockMovement(payload, start_date, end_date) {
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_stock_movement");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate;
        }
        const data = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_STOCK_ITEMS, 'POST', this.EbmRequestPayload(payload));
        if (data.resultCd !== "000" && data.resultCd !== "001") {
            throw data;
        }
        if (data.resultCd === "000") {
            payload.lastRequestDate = new Date(data.resultDt);
            const movements = data.data.stockItemList;
            await this.listStockMovementRepository.createManyStockMovements(movements, payload);
            return await this.listStockMovementRepository.findAll(payload);
        }
        return await this.listStockMovementRepository.findAll(payload, start_date, end_date);
    }
}
exports.ListStockMovementService = ListStockMovementService;
