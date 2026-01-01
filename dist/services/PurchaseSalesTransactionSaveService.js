"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSalesTransactionSaveService = void 0;
const PurchaseSalesTransactionRepository_1 = require("../repositories/PurchaseSalesTransactionRepository");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
const PurchaseSalesTransactionService_1 = require("./PurchaseSalesTransactionService");
class PurchaseSalesTransactionSaveService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.purchaseSalesTransactionService = new PurchaseSalesTransactionService_1.PurchaseSalesTransactionService();
        this.purchaseSalesTransactionRepository = new PurchaseSalesTransactionRepository_1.PurchaseSalesTransactionRepository();
    }
    async savePurchaseSalesTransaction(purchase, id, payload) {
        console.log(purchase);
        const data = await this.apiService.fetch(UrlPath_1.UrlPath.SAVE_PURCHASES, 'POST', purchase);
        if (data.resultCd !== "000") {
            throw data;
        }
        if (id) {
            await this.purchaseSalesTransactionRepository.updatePurchaseItem(purchase, id);
        }
        await this.purchaseSalesTransactionService.saveSyncPurchaseSalesTransaction(payload, true);
        return data;
    }
}
exports.PurchaseSalesTransactionSaveService = PurchaseSalesTransactionSaveService;
