import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { SaveStockMaster } from "../models/SaveStockMaster";
import { StockInOutSave } from "../models/StockInOutSave";
import { SaveStockMasterRepository } from "../repositories/SaveStockMasterRepository";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { StoreNumberRecordService } from "./StoreNumberRecordService";

export class SaveStockInOutService extends BaseEbmSyncService {
    private apiService: ApiServices = new (class extends ApiServices { })();
    private saveStockMasterRepository: SaveStockMasterRepository;
    private storeNumberRecordService: StoreNumberRecordService;

    constructor() {
        super();
        this.saveStockMasterRepository = new SaveStockMasterRepository();
        this.storeNumberRecordService = new StoreNumberRecordService();
    }

    async saveStockIOEndPoint(data: StockInOutSave) : Promise<any> {
        const result = await this.apiService.fetch(UrlPath.SAVE_STOCK_ITEMS, 'POST', data);
        if((result as any).resultCd !== "000"){
            throw result;
        }
        return result;
    }

    async saveStockInOut(stockInOut: StockInOutSave, payload: EbmSyncStatus): Promise<any> {
        stockInOut.tin = payload.tin;
        stockInOut.bhfId = payload.bhfId
        const nextSarNo = await this.storeNumberRecordService.getNextSarNo(payload.tin, payload.bhfId);
        stockInOut.sarNo = nextSarNo;
        stockInOut.orgSarNo = nextSarNo
        const data = await this.saveStockIOEndPoint(stockInOut);
        await this.storeNumberRecordService.createOrUpdateSarNo(payload.tin, payload.bhfId, nextSarNo);
        return data;
    }


    // save stock master
    async saveStockMasterEndPoint(stockMaster: SaveStockMaster) : Promise<any> {
        const result = await this.apiService.fetch(UrlPath.SAVE_STOCK_MASTER, 'POST', stockMaster);
        if((result as any).resultCd !== "000"){
            throw result;
        }
        return result;
    }
    async saveStockMaster(stockMaster: SaveStockMaster, payload: EbmSyncStatus): Promise<any> {
        stockMaster.tin = payload.tin;
        stockMaster.bhfId = payload.bhfId;
        const data = await this.saveStockMasterEndPoint(stockMaster);
        await this.saveStockMasterRepository.createOrUpdateStockMaster(stockMaster);
        return data;
    }

    async findAllStockMasters(payload: EbmSyncStatus): Promise<SaveStockMaster[]> {
        return this.saveStockMasterRepository.findAllByTinBhfId(payload.tin, payload.bhfId);
    }

    async findStockMaster(payload: EbmSyncStatus, itemCd: string): Promise<SaveStockMaster | null> {
        const allStockMasters = await this.findAllStockMasters(payload);
        return allStockMasters.find(stockMaster => stockMaster.itemCd === itemCd) || null;  
    }
    
}