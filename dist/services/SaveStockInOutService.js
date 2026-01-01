"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveStockInOutService = void 0;
const SaveStockMasterRepository_1 = require("../repositories/SaveStockMasterRepository");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class SaveStockInOutService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.saveStockMasterRepository = new SaveStockMasterRepository_1.SaveStockMasterRepository();
    }
    async saveStockInOut(stockInOut, payload) {
        stockInOut.tin = payload.tin;
        stockInOut.bhfId = payload.bhfId;
        const data = await this.apiService.fetch(UrlPath_1.UrlPath.SAVE_STOCK_ITEMS, 'POST', stockInOut);
        if (data.resultCd !== "000") {
            throw data;
        }
        return data;
    }
    // save stock master
    async saveStockMaster(stockMaster, payload) {
        stockMaster.tin = payload.tin;
        stockMaster.bhfId = payload.bhfId;
        const data = await this.apiService.fetch(UrlPath_1.UrlPath.SAVE_STOCK_MASTER, 'POST', stockMaster);
        if (data.resultCd !== "000") {
            throw data;
        }
        await this.saveStockMasterRepository.createOrUpdateStockMaster(stockMaster);
        return data;
    }
}
exports.SaveStockInOutService = SaveStockInOutService;
