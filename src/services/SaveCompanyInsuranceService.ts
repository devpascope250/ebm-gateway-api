import { SaveCompanyInsurance } from "../models/SaveCompanyInsurance";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";

export class SaveCompanyInsuranceService extends ApiServices{
   async saveCompanyInsurance(data: SaveCompanyInsurance): Promise<ResultData> {
        return await this.fetch(UrlPath.SAVE_COMPANY_INSURANCE, "POST", data);
    }
}