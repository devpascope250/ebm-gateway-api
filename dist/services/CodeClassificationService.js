"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeClassificationService = void 0;
const CodeClassificationRepository_1 = require("../repositories/CodeClassificationRepository");
const undici_1 = require("undici");
const UrlPath_1 = require("../utils/UrlPath");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
const date_time_1 = require("../utils/date-time");
class CodeClassificationService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor(tin, bhfId, lastRequestDate) {
        super();
        this.codeClassification = new CodeClassificationRepository_1.CodeClassificationRepository();
        this.tin = tin;
        this.bhfId = bhfId;
        this.lastRequestDate = lastRequestDate;
    }
    async loadEbmSyncStatus() {
        let code = await this.getEbmSyncStatusByEntityName("code_classification");
        if (!code) {
            code = {
                tin: this.tin,
                bhfId: this.bhfId,
                lastRequestDate: this.lastRequestDate,
                clientId: "" // Add clientId initialization
            };
        }
        return code;
    }
    async LoadClassifications(code) {
        const codes = await (0, undici_1.request)(UrlPath_1.UrlPath.SELECT_CODE, {
            method: "POST",
            body: JSON.stringify(this.EbmRequestPayload(code)),
            headers: {
                "Content-Type": "application/json",
            },
            // time out after 15 munutes
            bodyTimeout: 15 * 60 * 1000,
        });
        const data = await codes.body.json();
        return data;
    }
    async getAll() {
        try {
            // console.log(this.EbmRequestPayload(code));
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data;
            if (result.resultCd === "000") {
                const resultdata = data.data.clsList;
                code.lastRequestDate = date_time_1.DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code, "code_classification", resultdata);
                return await this.codeClassification.findAll();
            }
            else {
                return await this.codeClassification.findAll();
            }
        }
        catch (err) {
            throw err;
        }
    }
    // get classification by code
    async getBycdCls(cdCls) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data;
            if (result.resultCd === "000") {
                const resultdata = data.data.clsList;
                code.lastRequestDate = date_time_1.DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code, "code_classification", resultdata);
                return await this.codeClassification.findByCdCls(cdCls);
            }
            return await this.codeClassification.findByCdCls(cdCls);
        }
        catch (err) {
            throw err;
        }
    }
    // get all classification 
    async getAllClassification() {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data;
            if (result.resultCd === "000") {
                const resultdata = data.data.clsList;
                code.lastRequestDate = date_time_1.DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code, "code_classification", resultdata);
                return await this.codeClassification.getAllClassificationCode();
            }
            return await this.codeClassification.getAllClassificationCode();
        }
        catch (err) {
            throw err;
        }
    }
    // get code lis
    async getCodeList(cdCls) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data;
            if (result.resultCd === "000") {
                const resultdata = data.data.clsList;
                code.lastRequestDate = date_time_1.DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code, "code_classification", resultdata);
                return await this.codeClassification.getAllCodeList(cdCls);
            }
            return await this.codeClassification.getAllCodeList(cdCls);
        }
        catch (err) {
            throw err;
        }
    }
    async getCodeListByCdClsNm(cdClsNm, query) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data;
            if (result.resultCd === "000") {
                const resultdata = data.data.clsList;
                code.lastRequestDate = date_time_1.DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code, "code_classification", resultdata);
                return await this.codeClassification.findByCdClsNm(cdClsNm, query);
            }
            return await this.codeClassification.findByCdClsNm(cdClsNm, query);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.CodeClassificationService = CodeClassificationService;
