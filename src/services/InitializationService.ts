import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";

export class InitializaionService extends ApiServices {

    async initialize(data: EbmSyncStatus): Promise<ResultData> {
        const payload = {
            tin: data.tin,
            bhfId: data.bhfId,
            dvcSrlNo: process.env.EBM_DEVICE_SERIAL_NUMBER || "",
        };
        const result = await this.fetch(UrlPath.INITIALIZATION, "POST", payload);
        return result;
    }
}