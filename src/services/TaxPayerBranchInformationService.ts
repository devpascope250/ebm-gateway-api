import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { TaxPayerBranchInformation } from "../models/TaxBranchInformation";
import { TaxPayerBranchInformationRepository } from "../repositories/TaxPayerBranchInformationRepository";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";

export class TaxPayerBranchInformationService extends BaseEbmSyncService {
    private taxPayerBranchInformation: TaxPayerBranchInformationRepository;
    private apiService: ApiServices = new (class extends ApiServices{})();
    constructor() {
        super();
        this.taxPayerBranchInformation = new TaxPayerBranchInformationRepository();

          // preserve `this` when methods are used as route handlers
        // this.getAllTaxPayerBranchInformation = this.getAllTaxPayerBranchInformation.bind(this);
        // this.getTaxPayerBranchInformationByTinBybhfId = this.getTaxPayerBranchInformationByTinBybhfId.bind(this);
    }

    // get all taxpayer branch information
    async getAllTaxPayerBranchInformation(payload: EbmSyncStatus) {
        const existedebmStatus = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "tax_payer_branch_information");
        if (existedebmStatus) {
            payload.lastRequestDate = existedebmStatus.lastRequestDate
        }

        const loadTaxPayer = await this.apiService.fetch(UrlPath.SELECT_BRANCH, "POST",
            this.EbmRequestPayload(payload)
        )
       
        if ((loadTaxPayer as ResultData).resultCd === "000") {
            const loadTaxPayerData = loadTaxPayer.data.bhfList as TaxPayerBranchInformation[];
            if (loadTaxPayerData.length > 0) {
                payload.lastRequestDate = DateUtils.parse(loadTaxPayer.resultDt);
                await this.taxPayerBranchInformation.createWithTransaction(loadTaxPayerData, payload);
                return await this.taxPayerBranchInformation.getAll(payload);
            }

        }
        return await this.taxPayerBranchInformation.getAll(payload);
    }

    public async getTaxPayerBranchInformationByTinBybhfId(payload: EbmSyncStatus): Promise<TaxPayerBranchInformation[]> {
        const existedebmStatus = await this.getEbmSyncStatusByEntityName("tax_payer_branch_information");
        if (existedebmStatus) {
            payload.lastRequestDate = existedebmStatus.lastRequestDate;
        }
        const loadTaxPayer = await this.apiService.fetch(UrlPath.SELECT_BRANCH, "POST",
            this.EbmRequestPayload(payload)
        );

        if ((loadTaxPayer as ResultData).resultCd === "000") {
            const loadTaxPayerData = loadTaxPayer.data.bhfList as TaxPayerBranchInformation[];
            if (loadTaxPayerData.length > 0) {
               payload.lastRequestDate = DateUtils.parse(loadTaxPayer.resultDt)
                await this.taxPayerBranchInformation.createWithTransaction(loadTaxPayerData, payload);
                return await this.taxPayerBranchInformation.getBranchByTinByBhfId(payload.tin, payload.bhfId);
            }
        }
        return await this.taxPayerBranchInformation.getBranchByTinByBhfId(payload.tin, payload.bhfId);

    }
}