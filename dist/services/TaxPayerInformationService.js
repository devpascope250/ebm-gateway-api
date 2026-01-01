"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerInformationService = void 0;
const TaxPayerInformationRepository_1 = require("../repositories/TaxPayerInformationRepository");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
class TaxPayerInformationService extends ApiServices_1.ApiServices {
    constructor(tin, bhfId, custmTin) {
        super();
        this.instance = new TaxPayerInformationRepository_1.TaxPayerInformationRepository();
        this.tin = tin;
        this.bhfId = bhfId;
        this.custmTin = custmTin;
    }
    async getAllTaxPayers() {
        return await this.instance.findAll();
    }
    // findOnebyTin
    async findOneByTin() {
        // check if tin exists
        const existed = await this.instance.getTaxPayerByTin(this.tin);
        if (!existed) {
            const loadTaxPayer = await this.fetch(UrlPath_1.UrlPath.SELECT_CUSTOMER, "POST", { tin: this.tin, bhfId: this.bhfId, custmTin: this.custmTin });
            if (loadTaxPayer.resultCd === "000") {
                const result = loadTaxPayer.data.custList;
                if (result.length > 0) {
                    await this.instance.createTaxPayerInformation(result[0]);
                }
            }
        }
        return await this.instance.getTaxPayerByTin(this.tin);
    }
}
exports.TaxPayerInformationService = TaxPayerInformationService;
