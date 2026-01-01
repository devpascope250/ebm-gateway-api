"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerBranchInformationService = void 0;
const TaxPayerBranchInformationRepository_1 = require("../repositories/TaxPayerBranchInformationRepository");
const date_time_1 = require("../utils/date-time");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class TaxPayerBranchInformationService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiService = new (class extends ApiServices_1.ApiServices {
        })();
        this.taxPayerBranchInformation = new TaxPayerBranchInformationRepository_1.TaxPayerBranchInformationRepository();
        // preserve `this` when methods are used as route handlers
        // this.getAllTaxPayerBranchInformation = this.getAllTaxPayerBranchInformation.bind(this);
        // this.getTaxPayerBranchInformationByTinBybhfId = this.getTaxPayerBranchInformationByTinBybhfId.bind(this);
    }
    // get all taxpayer branch information
    async getAllTaxPayerBranchInformation(payload) {
        const existedebmStatus = await this.getEbmSyncStatusTinBhfIdEntityName(payload.tin, payload.bhfId, "tax_payer_branch_information");
        if (existedebmStatus) {
            payload.lastRequestDate = existedebmStatus.lastRequestDate;
        }
        const loadTaxPayer = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_BRANCH, "POST", this.EbmRequestPayload(payload));
        if (loadTaxPayer.resultCd === "000") {
            const loadTaxPayerData = loadTaxPayer.data.bhfList;
            if (loadTaxPayerData.length > 0) {
                payload.lastRequestDate = date_time_1.DateUtils.parse(loadTaxPayer.resultDt);
                await this.taxPayerBranchInformation.createWithTransaction(loadTaxPayerData, payload);
                return await this.taxPayerBranchInformation.getAll(payload);
            }
        }
        return await this.taxPayerBranchInformation.getAll(payload);
    }
    async getTaxPayerBranchInformationByTinBybhfId(payload) {
        const existedebmStatus = await this.getEbmSyncStatusByEntityName("tax_payer_branch_information");
        if (existedebmStatus) {
            payload.lastRequestDate = existedebmStatus.lastRequestDate;
        }
        const loadTaxPayer = await this.apiService.fetch(UrlPath_1.UrlPath.SELECT_BRANCH, "POST", this.EbmRequestPayload(payload));
        if (loadTaxPayer.resultCd === "000") {
            const loadTaxPayerData = loadTaxPayer.data.bhfList;
            if (loadTaxPayerData.length > 0) {
                payload.lastRequestDate = date_time_1.DateUtils.parse(loadTaxPayer.resultDt);
                await this.taxPayerBranchInformation.createWithTransaction(loadTaxPayerData, payload);
                return await this.taxPayerBranchInformation.getBranchByTinByBhfId(payload.tin, payload.bhfId);
            }
        }
        return await this.taxPayerBranchInformation.getBranchByTinByBhfId(payload.tin, payload.bhfId);
    }
}
exports.TaxPayerBranchInformationService = TaxPayerBranchInformationService;
