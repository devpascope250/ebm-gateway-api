"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNoticeService = void 0;
const ListNoticeRepository_1 = require("../repositories/ListNoticeRepository");
const date_time_1 = require("../utils/date-time");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class ListNoticeService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.listNoticeRepository = new ListNoticeRepository_1.ListNoticeRepository();
    }
    // get all notice
    async getAllNotice(payload) {
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_notice");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate;
        }
        const loadNotice = await this.apiService.fetch(UrlPath_1.UrlPath.LIST_NOTICE, "POST", this.EbmRequestPayload(payload));
        if (loadNotice.resultCd === "000") {
            const data = loadNotice.data.noticeList;
            payload.lastRequestDate = date_time_1.DateUtils.parse(loadNotice.resultDt);
            await this.listNoticeRepository.insertMany(data, payload);
            return await this.listNoticeRepository.getAll(payload);
        }
        return await this.listNoticeRepository.getAll(payload);
    }
}
exports.ListNoticeService = ListNoticeService;
