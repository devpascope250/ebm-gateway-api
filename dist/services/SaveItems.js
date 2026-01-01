"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveItemsService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
const ItemListService_1 = require("./ItemListService");
class SaveItemsService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiServices = new (class extends ApiServices_1.ApiServices {
        })();
        this.itemsListSercive = new ItemListService_1.ItemListService();
    }
    async saveItems(data, payload) {
        data.tin = payload.tin;
        data.bhfId = payload.bhfId;
        data.modrId = "Admin";
        data.modrNm = "Admin";
        data.regrId = "Admin";
        data.regrNm = "Admin";
        const result = await this.apiServices.fetch(UrlPath_1.UrlPath.SAVE_ITEMS, "POST", data);
        await this.itemsListSercive.getItemsList(payload, true);
        return result;
    }
}
exports.SaveItemsService = SaveItemsService;
