"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportItemSaveService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const ImportItemSave_1 = require("../repositories/ImportItemSave");
class ImportItemSaveService extends ApiServices_1.ApiServices {
    constructor() {
        super();
        this.listImportItemRepository = new ImportItemSave_1.ImportItemSaveRepository();
    }
    async importItemSave(data, payload) {
        let result = {};
        if (Array.isArray(data) && data.length > 0) {
            for (const item of data) {
                item.tin = payload.tin;
                item.bhfId = payload.bhfId;
                result = await this.fetch(UrlPath_1.UrlPath.UPDATE_ITEMS_IMPORT_ITEMS, "POST", item);
                if (result.resultCd === "000") {
                    await this.listImportItemRepository.update(item, payload);
                    return result;
                }
                else {
                    throw result;
                }
            }
        }
        else {
            if (!Array.isArray(data)) {
                data.tin = payload.tin;
                data.bhfId = payload.bhfId;
                result = await this.fetch(UrlPath_1.UrlPath.UPDATE_ITEMS_IMPORT_ITEMS, "POST", data);
                if (result.resultCd === "000") {
                    await this.listImportItemRepository.update(data, payload);
                    return result;
                }
                else {
                    throw result;
                }
            }
        }
        return result;
    }
}
exports.ImportItemSaveService = ImportItemSaveService;
