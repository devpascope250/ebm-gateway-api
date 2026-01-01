import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ItemsList } from "../models/ItemsList";
import { ItemsListRepository } from "../repositories/ItemsListRepository";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import redisCache from "../utils/redisCache";
import { CacheNamespace } from "../types/cachesNameSpace";
export class ItemListService extends BaseEbmSyncService {
    private itemListRepository: ItemsListRepository;
    private apiService: ApiServices = new (class extends ApiServices { })();

    constructor() {
        super();
        this.itemListRepository = new ItemsListRepository();
    }
    async getItemsList(payload: EbmSyncStatus, refresh?: boolean): Promise<ItemsList[]> {
        const [namespace, key] = CacheNamespace.items.itemsList(payload.tin, payload.bhfId);
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "items_list");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate
        }
        
        const loadList = await this.apiService.fetch(UrlPath.SELECT_ITEMS, "POST",
            this.EbmRequestPayload(payload)
        );
        
        const loadedList = (loadList as ResultData);
        if (loadedList.resultCd === "000") {
            const data = loadList.data.itemList;
            payload.lastRequestDate = DateUtils.parse(loadedList.resultDt);
            await this.itemListRepository.createManyItems(data, payload);
            await redisCache.delete(namespace, key);
            await redisCache.save(namespace, key, data, {ttl: 86400});
            if (refresh) {
                return data;
            } else {
                  // Cache for 1 day
                return await this.itemListRepository.getAll(payload);
            }
        }
        if (refresh) {
            return [];
        } else {
            // const cache = await redisCache.get(namespace, key);
            
            // if (cache) {
            //     return cache as ItemsList[];
            // }
            const resData = await this.itemListRepository.getAll(payload);
            await redisCache.save(namespace, key, resData, {ttl: 86400});
            return resData;
        }
    }

    async getItemsListByItemCd(payload: EbmSyncStatus, itemCd: string | Array<{ itemCd: string }>): Promise<ItemsList[]> {
        return await this.itemListRepository.getByTinBhfIdAndItemCd(payload.tin, payload.bhfId, itemCd);
    }

}