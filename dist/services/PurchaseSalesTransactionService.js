"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSalesTransactionService = void 0;
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
const date_time_1 = require("../utils/date-time");
const UrlPath_1 = require("../utils/UrlPath");
const PurchaseSalesTransactionRepository_1 = require("../repositories/PurchaseSalesTransactionRepository");
class PurchaseSalesTransactionService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.purchaseSalesTransactionRepository = new PurchaseSalesTransactionRepository_1.PurchaseSalesTransactionRepository();
    }
    async saveSyncPurchaseSalesTransaction(payload, refresh) {
        try {
            const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "purchase_sales_transaction");
            if (status) {
                payload.lastRequestDate = status.lastRequestDate; // update lastRequestDate
            }
            const data = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_TRANSACTION_PURCHASE_SALES, 'POST', this.EbmRequestPayload(payload));
            if (data.resultCd !== "000" && data.resultCd !== "001" && data.resultCd !== "894") {
                throw data;
            }
            if (data.resultCd === "000") {
                payload.lastRequestDate = date_time_1.DateUtils.parse(data.resultDt);
                const purchase = data.data.saleList;
                await this.purchaseSalesTransactionRepository.createAll(purchase, payload);
                if (!refresh) {
                    const lastReq = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "purchase_sales_transaction");
                    return {
                        data: await this.purchaseSalesTransactionRepository.findByTinAndBhfId(payload.tin, payload.bhfId),
                        resultDt: lastReq?.lastRequestDate
                    };
                }
                else {
                    return purchase;
                }
            }
            if (!refresh) {
                return {
                    data: await this.purchaseSalesTransactionRepository.findByTinAndBhfId(payload.tin, payload.bhfId),
                    resultDt: status?.lastRequestDate
                };
            }
            else {
                return true;
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}
exports.PurchaseSalesTransactionService = PurchaseSalesTransactionService;
