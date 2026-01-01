"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListImportItemService = void 0;
const ListImportItemRepository_1 = require("../repositories/ListImportItemRepository");
const date_time_1 = require("../utils/date-time");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class ListImportItemService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.listImportItemRepository = new ListImportItemRepository_1.ListImportItemRepository();
    }
    async syncListImportItem(payload) {
        try {
            const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_import_item");
            if (status) {
                payload.lastRequestDate = status.lastRequestDate;
            }
            const loadListImportItem = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_IMPORT_ITEMS, "POST", this.EbmRequestPayload(payload));
            const loadedList = loadListImportItem;
            if (loadedList.resultCd !== "000" && loadedList.resultCd !== "001" && loadedList.resultCd !== "894") {
                throw loadListImportItem;
            }
            if (loadedList.resultCd === "000") {
                const data = loadListImportItem.data.itemList;
                payload.lastRequestDate = date_time_1.DateUtils.parse(loadedList.resultDt);
                await this.listImportItemRepository.createManyWithTransaction(data, payload);
                const lastDate = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_import_item");
                return {
                    data: await this.listImportItemRepository.getAll(payload),
                    resultDt: lastDate?.lastRequestDate ?? new Date()
                };
            }
            return {
                data: await this.listImportItemRepository.getAll(payload),
                resultDt: status?.lastRequestDate ?? new Date()
            };
        }
        catch (e) {
            throw e;
        }
    }
}
exports.ListImportItemService = ListImportItemService;
