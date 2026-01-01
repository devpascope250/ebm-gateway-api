"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesTransactionService = void 0;
const SalesTransactionRepository_1 = require("../repositories/SalesTransactionRepository");
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
const EbmSyncStatusService_1 = require("./EbmSyncStatusService");
class SalesTransactionService extends EbmSyncStatusService_1.BaseEbmSyncService {
    constructor() {
        super();
        this.apiservice = new (class extends ApiServices_1.ApiServices {
        })();
        this.salesTransactionRepository = new SalesTransactionRepository_1.SalesTransactionRepository();
    }
    async saveSalesTransaction(data, allInvo, payload) {
        // check if exist before save
        const salesTyCd = data.salesTyCd;
        const rcptTyCd = data.rcptTyCd;
        if (allInvo.length > 0) {
            await this.salesTransactionRepository.checkExistedInvoiceBeforeInsert(payload.tin, payload.bhfId, allInvo, salesTyCd + rcptTyCd);
        }
        let result = [];
        // check if data is type of Array
        if (Array.isArray(data)) {
            // loop through each item and save
            const sales = data;
            await Promise.all(sales.map(async (sale) => {
                const status = await this.apiservice.fetch(UrlPath_1.UrlPath.SAVE_SALES, "POST", sale);
                if (status.resultCd == "000") {
                    await this.salesTransactionRepository.createWithTransaction({ ...sale, tin: payload.tin, bhfId: payload.bhfId, response: status.data });
                    result = result ? [...result, status] : [status];
                }
                else if (status.resultCd == "924") {
                    result = result ? [...result, status] : [status];
                }
                else {
                    throw status;
                }
            }));
            return result;
        }
        else {
            const status = await this.apiservice.fetch(UrlPath_1.UrlPath.SAVE_SALES, "POST", { ...data, tin: payload.tin, bhfId: payload.bhfId });
            console.log(status);
            if (status.resultCd === "000") {
                await this.salesTransactionRepository.createWithTransaction({ ...data, tin: payload.tin, bhfId: payload.bhfId, response: status.data });
                return status;
            }
            else if (status.resultCd === "924") {
                // chech existed
                throw status;
                // const existed = await this.salesTransactionRepository.checkInvoiceExistedWithoutType(payload.tin, payload.bhfId, data.invcNo);
                // if (!existed) {
                //     await this.salesTransactionRepository.createWithTransaction({ ...data, tin: payload.tin, bhfId: payload.bhfId, response: status.data });
                //     return status;
                // } else {
                //     return status;
                // }
            }
            else {
                throw status;
            }
        }
    }
    async generateTransactionInvoice(payload, currentInv, allInvo, type, rfdRsnCd, freshInv) {
        //   console.log(payload, type, currentInv, allInvo);
        try {
            const invoice = await this.salesTransactionRepository.getSalesTransactionByTinAndBhfIdAndTypeAndInvcNo(payload.tin, payload.bhfId, type, currentInv, allInvo, freshInv);
            // console.log(invoice);
            const savesInvcNo = [];
            if (invoice.status === 404) {
                await this.salesTransactionRepository.checkExistedInvoiceBeforeInsert(payload.tin, payload.bhfId, allInvo, type);
                for (const [index, invv] of invoice.data.entries()) {
                    // remove reponse from invv
                    const invvCopy = { ...invv };
                    delete invvCopy.response;
                    invvCopy.salesTyCd = type.charAt(0);
                    invvCopy.rcptTyCd = type.charAt(1);
                    if (rfdRsnCd) {
                        invvCopy.rfdRsnCd = rfdRsnCd;
                    }
                    if (type === "NR" || type === "TR") {
                        invvCopy.orgInvcNo = invvCopy.invcNo;
                    }
                    if (allInvo.length > 0) {
                        invvCopy.invcNo = Number(allInvo[0].invcNo) + index + 1;
                        savesInvcNo.push({ invcNo: invvCopy.invcNo });
                    }
                    const status = await this.apiservice.fetch(UrlPath_1.UrlPath.SAVE_SALES, "POST", { ...invvCopy });
                    if (status.resultCd === "000") {
                        await this.salesTransactionRepository.createWithTransaction({ ...invvCopy, response: status.data });
                    }
                    else if (status.resultCd === "924") {
                        // chech existed
                        const existed = await this.salesTransactionRepository.checkInvoiceExistedWithoutType(payload.tin, payload.bhfId, invvCopy.invcNo);
                        console.log(existed, Number(allInvo[0].invcNo) + index + 1);
                        if (!existed) {
                            await this.salesTransactionRepository.createWithTransaction({ ...invvCopy, response: status.data });
                        }
                    }
                    else {
                        throw status;
                    }
                }
                if (savesInvcNo.length > 0) {
                    const nDa = await this.salesTransactionRepository.getSalesTransactionByTinAndBhfIdAndTypeAndInvcNo(payload.tin, payload.bhfId, type, savesInvcNo);
                    return {
                        status: 201,
                        data: nDa.data
                    };
                }
            }
            else {
                return invoice;
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    // get all sales reports
    async findAllSalesReport(payload, startDate, endDate) {
        return await this.salesTransactionRepository.getAllSalesReport(payload.tin, payload.bhfId, startDate, endDate);
    }
    async findLatestInvoiceId(payload) {
        return await this.salesTransactionRepository.getLatestInvoiceId(payload);
    }
    async findLatestSalesTransactionId(payload) {
        return await this.salesTransactionRepository.getLatestSalesTransactionId(payload);
    }
}
exports.SalesTransactionService = SalesTransactionService;
