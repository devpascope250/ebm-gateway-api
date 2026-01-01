"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemClassificationService = void 0;
const ItemClassificationRepository_1 = require("../repositories/ItemClassificationRepository");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class ItemClassificationService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.itemClassificationRepository = new ItemClassificationRepository_1.ItemClassificationRepository();
    }
    async getAllItemClassifications(requestStatus, query) {
        try {
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
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}
exports.ItemClassificationService = ItemClassificationService;
