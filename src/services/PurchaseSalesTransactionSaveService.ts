import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { PurchaseSalesTransactionSave } from "../models/PurchaseSalesTransactionSave";
import { PurchaseSalesTransactionRepository } from "../repositories/PurchaseSalesTransactionRepository";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { PurchaseSalesTransactionService } from "./PurchaseSalesTransactionService";

export class PurchaseSalesTransactionSaveService extends BaseEbmSyncService {
    private apiService: ApiServices = new (class extends ApiServices { })();
    private purchaseSalesTransactionService: PurchaseSalesTransactionService;
    private purchaseSalesTransactionRepository: PurchaseSalesTransactionRepository
    constructor() {
        super();
        this.purchaseSalesTransactionService = new PurchaseSalesTransactionService();
        this.purchaseSalesTransactionRepository = new PurchaseSalesTransactionRepository();
    }
    async savePurchaseSalesTransaction(purchase: PurchaseSalesTransactionSave,id: number, payload: EbmSyncStatus): Promise<any> {
        const data = await this.apiService.fetch(UrlPath.SAVE_PURCHASES, 'POST', purchase);
        if((data as ResultData).resultCd !== "000"){
            throw data;
        }
        if(id){
            await this.purchaseSalesTransactionRepository.updatePurchaseItem(purchase, id);
        }
        await this.purchaseSalesTransactionService.saveSyncPurchaseSalesTransaction(payload, true);
        return data;
    }

}