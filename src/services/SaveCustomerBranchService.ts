import { SaveCustomerBranch } from "../models/SaveBranchCustomer";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";

export class SaveCustomerBranchService extends ApiServices {

    async saveCustomerBranch(data: SaveCustomerBranch): Promise<ResultData> {
        return await this.fetch(UrlPath.SAVE_CUSTOMER_BRANCH, "POST", data);
    }
}