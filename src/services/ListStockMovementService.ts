import { ListStockMovement } from "../models/ListStockMovement";
import { ListStockMovementRepository } from "../repositories/ListStockMovementRepository";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";

export class ListStockMovementService extends BaseEbmSyncService {
    private apiService: ApiServices = new (class extends ApiServices { })();
    private listStockMovementRepository: ListStockMovementRepository;

    constructor() {
        super();
        this.listStockMovementRepository = new ListStockMovementRepository();
    }
    async fetchStockMovement(payload: any, start_date?: string, end_date?: string): Promise<ListStockMovement[]> {
        const status = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "list_stock_movement");
        if (status) {
            payload.lastRequestDate = status.lastRequestDate;
        }
        const data = await this.apiService.fetch(UrlPath.SELECT_STOCK_ITEMS, 'POST', this.EbmRequestPayload(payload));

        if ((data as ResultData).resultCd !== "000" && (data as ResultData).resultCd !== "001") {
            throw data;
        }
        if ((data as ResultData).resultCd === "000") {
            payload.lastRequestDate = new Date((data as ResultData).resultDt);
            const movements = data.data.stockItemList as ListStockMovement[];
            await this.listStockMovementRepository.createManyStockMovements(movements, payload);
            return await this.listStockMovementRepository.findAll(payload);
        }
        return await this.listStockMovementRepository.findAll(payload, start_date, end_date);
    }
}