import { request } from "undici";
import { ItemClassificationRepository } from "../repositories/ItemClassificationRepository";
import { UrlPath } from "../utils/UrlPath";
import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { ItemClassification } from "../models/ItemClassification";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";

export class ItemClassificationService extends BaseEbmSyncService {
    private itemClassificationRepository: ItemClassificationRepository;

    constructor() {
        super();
        this.itemClassificationRepository = new ItemClassificationRepository();
    }

    async getAllItemClassifications(requestStatus: EbmSyncStatus, query?: string): Promise<ItemClassification[]> {
        try{
            // let payloyd = {
            //     ...requestStatus
            // }
            // const code = await this.getEbmSyncStatusByEntityName("item_classification");
           
            
            // if(code){
            //     payloyd = {
            //         ...requestStatus,
            //         lastRequestDate: code.lastRequestDate
            //     }
            // }
            // const loadData = await request(UrlPath.SELECT_ITEMS_CLASSIFICATION, {
            //     method: 'POST',
            //     bodyTimeout: 15 * 60 * 1000, // 15 minutes of inactivity
            //     headersTimeout: 15 * 60 * 1000, // 15 minutes of inactivity
            //     body: JSON.stringify(this.EbmRequestPayload(payloyd)),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // })

            // const data = await loadData.body.json();
            // if((data as ResultData).resultCd === "000"){
            //     const res = ((data as ResultData).data as any).itemClsList as ItemClassification[];
            //     payloyd.lastRequestDate = DateUtils.parse((data as ResultData).resultDt);
            //     await this.itemClassificationRepository.createWithTransaction(res, payloyd.lastRequestDate);
            //     return await this.itemClassificationRepository.findAll(query);
            // }
            return await this.itemClassificationRepository.findAll(query);
        }catch(err){
            console.log(err);
            return [];
        }
    }
}