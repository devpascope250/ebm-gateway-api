import { CodeClassificationRepository } from "../repositories/CodeClassificationRepository";
import { request } from "undici";
import { UrlPath } from "../utils/UrlPath";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { ResultData } from "../types/data";
import { DateUtils } from "../utils/date-time";
import { ResCodeData } from "../types/types";
import { EbmSyncStatus } from "../models/EbmSyncStatus";
export class CodeClassificationService extends BaseEbmSyncService {
    private codeClassification = new CodeClassificationRepository();
    private tin: string;
    private bhfId: string;
    private lastRequestDate?: Date;
    constructor(tin: string, bhfId: string, lastRequestDate?: Date) {
        super();
        this.tin = tin;
        this.bhfId = bhfId;
        this.lastRequestDate = lastRequestDate;
    }
    protected async loadEbmSyncStatus(): Promise<EbmSyncStatus> {
        let code = await this.getEbmSyncStatusByEntityName("code_classification");
        if (!code) {
            code = {
                tin: this.tin,
                bhfId: this.bhfId,
                lastRequestDate: this.lastRequestDate,
                clientId: "" // Add clientId initialization
            }
        }
        return code;
    }

    protected async LoadClassifications(code: EbmSyncStatus) {
        const codes = await request(UrlPath.SELECT_CODE, {
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
            const result = data as ResultData;
            if (result.resultCd === "000") {
                const resultdata = (data as ResCodeData).data.clsList;
                code.lastRequestDate = DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code,"code_classification", resultdata);
                return await this.codeClassification.findAll();
            } else {
                return await this.codeClassification.findAll();
            }
        } catch (err) {
            throw err;
        }
    }

    // get classification by code
    async getBycdCls(cdCls: string) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data as ResultData;
            if (result.resultCd === "000") {
                const resultdata = (data as ResCodeData).data.clsList;
                code.lastRequestDate = DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code,"code_classification", resultdata);
                return await this.codeClassification.findByCdCls(cdCls);
            }
            return await this.codeClassification.findByCdCls(cdCls);
        } catch (err) {
            throw err;
        }
    }

    // get all classification 

    async getAllClassification() {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data as ResultData;
            if (result.resultCd === "000") {
                const resultdata = (data as ResCodeData).data.clsList;
                code.lastRequestDate = DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code,"code_classification", resultdata);
                return await this.codeClassification.getAllClassificationCode();
            }
            return await this.codeClassification.getAllClassificationCode();
        } catch (err) {
            throw err;
        }
    }

    // get code lis
    async getCodeList(cdCls: string) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data as ResultData;
            if (result.resultCd === "000") {
                const resultdata = (data as ResCodeData).data.clsList;
                code.lastRequestDate = DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code,"code_classification", resultdata);
                return await this.codeClassification.getAllCodeList(cdCls);
            }
            return await this.codeClassification.getAllCodeList(cdCls);
        } catch (err) {
            throw err;
        }
    }


    async getCodeListByCdClsNm(cdClsNm: string, query?: string) {
        try {
            let code = await this.loadEbmSyncStatus();
            const data = await this.LoadClassifications(code);
            const result = data as ResultData;
            if (result.resultCd === "000") {
                const resultdata = (data as ResCodeData).data.clsList;
                code.lastRequestDate = DateUtils.parse(result.resultDt);
                await this.codeClassification.create(code,"code_classification", resultdata);
                return await this.codeClassification.findByCdClsNm(cdClsNm, query);
            }
            return await this.codeClassification.findByCdClsNm(cdClsNm, query);
        } catch (err) {
            throw err;
        }
    }
}
