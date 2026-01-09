import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { PurchaseSalesTransaction } from "../models/PurchaseSalesTransaction";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { PurchaseSalesTransactionRepository } from "../repositories/PurchaseSalesTransactionRepository";
import { CacheNamespace } from "../types/cachesNameSpace";
import redisCache from "../utils/redisCache";
export class PurchaseSalesTransactionService extends BaseEbmSyncService {
    private apiService: ApiServices = new (class extends ApiServices { })();
    private purchaseSalesTransactionRepository: PurchaseSalesTransactionRepository;

    constructor() {
        super();
        this.purchaseSalesTransactionRepository = new PurchaseSalesTransactionRepository();
    }
    async saveSyncPurchaseSalesTransaction(payload: EbmSyncStatus, refresh?: boolean, start_date?: string, end_date?: string) {
        const [namespace, key] = CacheNamespace.purchases.listPurchases(payload.tin, payload.bhfId);
        try {
            const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "purchase_sales_transaction");
            if (status) {
                payload.lastRequestDate = status.lastRequestDate; // update lastRequestDate
            }

            const data = await this.apiService.fetch(UrlPath.SELECT_TRANSACTION_PURCHASE_SALES, 'POST', this.EbmRequestPayload(payload));
            if ((data as ResultData).resultCd !== "000" && (data as ResultData).resultCd !== "001" && (data as ResultData).resultCd !== "894") {
                throw data;
            }
            if ((data as ResultData).resultCd === "000") {
                // await redisCache.delete(namespace, key);
                payload.lastRequestDate = new Date();
                const purchase = data.data.saleList;
                await this.purchaseSalesTransactionRepository.createAll(purchase, payload);
                if (!refresh) {
                    const retData = {
                        data: await this.purchaseSalesTransactionRepository.findByTinAndBhfId(payload.tin, payload.bhfId, start_date, end_date),
                        resultDt: DateUtils.parse((data as ResultData).resultDt),
                        message: "New Purchase Items Added Well!"
                    }
                    // await redisCache.save(namespace, key, retData);
                    return retData
                } else {
                    return purchase;
                }
            }
            if (!refresh) {
                // const cache = await redisCache.get(namespace, key);
                // if(cache){
                //     return cache;
                // }
                const saveDAta = {
                    data: await this.purchaseSalesTransactionRepository.findByTinAndBhfId(payload.tin, payload.bhfId, start_date, end_date),
                    resultDt: status?.lastRequestDate,
                    message: "Not New Purchase Items!"   
                }
                // await redisCache.save(namespace, key, saveDAta);
                return saveDAta
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);

            throw error;
        }

    }
}