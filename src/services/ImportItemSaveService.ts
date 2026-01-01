import { log } from "node:console";
import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ImportItemSave } from "../models/ImportItemSave";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { ImportItemSaveRepository } from "../repositories/ImportItemSave";

export class ImportItemSaveService extends ApiServices {
    private listImportItemRepository: ImportItemSaveRepository;

    constructor() {
        super();
        this.listImportItemRepository = new ImportItemSaveRepository();
    }

    async importItemSave(data: ImportItemSave | ImportItemSave[], payload: EbmSyncStatus): Promise<ResultData> {
        let result: ResultData = {} as ResultData;
        if (Array.isArray(data) && data.length > 0) {
            for (const item of data) {
                item.tin = payload.tin;
                item.bhfId = payload.bhfId;
                result = await this.fetch(UrlPath.UPDATE_ITEMS_IMPORT_ITEMS, "POST", item);
                if (result.resultCd === "000") {
                    await this.listImportItemRepository.update(item, payload);
                    return result
                } else {
                    throw result
                }
            }
        } else {
            if (!Array.isArray(data)) {
                data.tin = payload.tin;
                data.bhfId = payload.bhfId;
                result = await this.fetch(UrlPath.UPDATE_ITEMS_IMPORT_ITEMS, "POST", data);
                if (result.resultCd === "000") {
                    await this.listImportItemRepository.update(data, payload);
                    return result
                } else {
                    throw result
                }
            }
        }
        return result;
    }

}