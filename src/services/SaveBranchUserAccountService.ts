import { SaveBranchUsers } from "../models/SaveBranchUsers";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";

export class SaveBranchUserAccountService extends ApiServices {
    async saveBranchUserAccount(data: SaveBranchUsers): Promise<ResultData> {
        return await this.fetch(UrlPath.SAVE_BRANCH_USER, "POST", data);
    }
}