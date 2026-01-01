"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemListService = void 0;
const ItemsListRepository_1 = require("../repositories/ItemsListRepository");
const date_time_1 = require("../utils/date-time");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class ItemListService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.itemListRepository = new ItemsListRepository_1.ItemsListRepository();
    }
    async getItemsList(payload, refresh) {
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "items_list");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate;
        }
        const loadList = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_ITEMS, "POST", this.EbmRequestPayload(payload));
        const loadedList = loadList;
        if (loadedList.resultCd === "000") {
            const data = loadList.data.itemList;
            payload.lastRequestDate = date_time_1.DateUtils.parse(loadedList.resultDt);
            await this.itemListRepository.createManyItems(data, payload);
            if (refresh) {
                return data;
            }
            else {
                return await this.itemListRepository.getAll(payload);
            }
        }
        if (refresh) {
            return [];
        }
        else {
            return await this.itemListRepository.getAll(payload);
        }
    }
    async getItemsListByItemCd(payload, itemCd) {
        return await this.itemListRepository.getByTinBhfIdAndItemCd(payload.tin, payload.bhfId, itemCd);
    }
}
exports.ItemListService = ItemListService;
