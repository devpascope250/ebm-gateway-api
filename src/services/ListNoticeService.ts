import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ListNotice } from "../models/ListNotice";
import { ListNoticeRepository } from "../repositories/ListNoticeRepository";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import redisCache from "../utils/redisCache";
import { CacheNamespace } from "../types/cachesNameSpace";
export class ListNoticeService extends BaseEbmSyncService {
    private listNoticeRepository: ListNoticeRepository;
    private apiService: ApiServices = new (class extends ApiServices { })();
    constructor() {
        super();
        this.listNoticeRepository = new ListNoticeRepository();
    }
    // get all notice

    public async getAllNotice(payload: EbmSyncStatus): Promise<ListNotice[]> {
        const [namespace, key] = CacheNamespace.noticesList.listNotices(payload.tin, payload.bhfId);
        // const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_notice");
        // if (status) {
        //     payload.lastRequestDate = status.lastRequestDate;
        // }
        const loadNotice = await this.apiService.fetch(UrlPath.LIST_NOTICE, "POST",
            this.EbmRequestPayload(payload)
        );
        if ((loadNotice as ResultData).resultCd === "000") {
            await redisCache.delete(namespace, key);
            const data = loadNotice.data.noticeList as ListNotice[];
            payload.lastRequestDate = new Date();
            await this.listNoticeRepository.insertMany(data, payload);
            const retData = await this.listNoticeRepository.getAll(payload);
            await redisCache.save(namespace, key, retData);
            return retData
        }
        
        const cache = await redisCache.get(namespace, key);
        if(cache){
            return cache as ListNotice[];
        }
        const retData = await this.listNoticeRepository.getAll(payload);
        await redisCache.save(namespace, key, retData);
        return retData
    }

}