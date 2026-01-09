import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { SaveItems } from "../models/SaveItems";
import { ItemsListRepository } from "../repositories/ItemsListRepository";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { ItemListService } from "./ItemListService";

export class SaveItemsService extends BaseEbmSyncService {
    private itemsListSercive: ItemListService;
    private itemsListRepository: ItemsListRepository = new ItemsListRepository();
    private apiServices: ApiServices = new (class extends ApiServices { })();
    constructor() {
        super();
        this.itemsListSercive = new ItemListService();
    }
    async saveItems(data: SaveItems, payload: EbmSyncStatus): Promise<ResultData> {
        data.tin = payload.tin;
        data.bhfId = payload.bhfId;
        data.modrId = "Admin";
        data.modrNm = "Admin";
        data.regrId = "Admin";
        data.regrNm = "Admin";

        const checkItemExist = await this.itemsListRepository.checkExistedItem(data.itemCd, payload);
        if(checkItemExist){
            throw {
                resultCd: "999",
                resultMsg: "Item code already exist"
            }
        }
        const result = await this.apiServices.fetch(UrlPath.SAVE_ITEMS, "POST", data);
        await this.itemsListSercive.getItemsList(payload, true);
        return result;
    }
}