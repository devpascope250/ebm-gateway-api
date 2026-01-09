import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ListImportItem } from "../models/ListImportItem";
import { ListImportItemRepository } from "../repositories/ListImportItemRepository";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import redisCache from "../utils/redisCache";
import { CacheNamespace } from "../types/cachesNameSpace";
export class ListImportItemService extends BaseEbmSyncService {
    private listImportItemRepository: ListImportItemRepository;
    private apiService: ApiServices = new (class extends ApiServices { })();
    constructor() {
        super();
        this.listImportItemRepository = new ListImportItemRepository();
    }

    async syncListImportItem(payload: EbmSyncStatus, start_date?: string, end_date?: string): Promise<{data: ListImportItem[], resultDt: Date}> {
        const [namespace, key] = CacheNamespace.imported.listImported(payload.tin, payload.bhfId);
        try{
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_import_item");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate;
        }
        const loadListImportItem = await this.apiService.fetch(UrlPath.SELECT_IMPORT_ITEMS, "POST",
            this.EbmRequestPayload(payload)
        );
        const loadedList = (loadListImportItem as ResultData);
        if( loadedList.resultCd !== "000" && loadedList.resultCd !== "001" && loadedList.resultCd !== "894") {
            throw loadListImportItem;
        }

        if (loadedList.resultCd === "000") {
            await redisCache.delete(namespace, key);
            const data = loadListImportItem.data.itemList as ListImportItem[];
            payload.lastRequestDate = new Date();
            await this.listImportItemRepository.createManyWithTransaction(data, payload);
            const returnData = {
                data: await this.listImportItemRepository.getAll(payload, start_date, end_date),
                resultDt:  new Date(),
                message: "New Items Imported!"
            }
            // await redisCache.save(namespace, key, returnData);
            return returnData
        }
        // const cache = await redisCache.get(namespace, key);
        // const cached = cache as {data: ListImportItem[], resultDt: Date};
        // if(cached.data.length > 0){
        //     return {
        //         data: cached.data,
        //         resultDt: cached.resultDt
        //     }
            
        // }else{
             const retData = {
            data: await this.listImportItemRepository.getAll(payload, start_date, end_date),
            resultDt: status?.lastRequestDate ?? new Date(),
            message: "There is No New Item Found!"

        }
        // await redisCache.save(namespace, key, retData);
        return retData
        // }
       
    }catch(e) {
        throw e;
    }
}
}