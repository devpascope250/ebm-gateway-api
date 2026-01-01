import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { InvoiceIds } from "../models/ItemsList";
import { SalesTransaction } from "../models/SalesTransaction";
import { SaveStockMaster } from "../models/SaveStockMaster";
import { StockInOutSave } from "../models/StockInOutSave";
import { SalesTransactionRepository } from "../repositories/SalesTransactionRepository";
import { DateUtils } from "../utils/date-time";
import { UrlPath } from "../utils/UrlPath";
import { ReceiptType } from "../utils/utile-data";
import { ApiServices } from "./ApiServices";
import { BaseEbmSyncService } from "./EbmSyncStatusService";
import { SaveStockInOutService } from "./SaveStockInOutService";

export class SalesTransactionService extends BaseEbmSyncService {
    private salesTransactionRepository: SalesTransactionRepository;
    private apiservice: ApiServices = new (class extends ApiServices { })();
    private stockIOService: SaveStockInOutService = new SaveStockInOutService();
    constructor() {
        super();
        this.salesTransactionRepository = new SalesTransactionRepository();
    }
    async saveSalesTransaction(data: any, allInvo: InvoiceIds[], payload: EbmSyncStatus) {        
        // check if exist before save
        const salesTyCd = data.salesTyCd as string;
        const rcptTyCd = data.rcptTyCd as string;
        if(allInvo.length > 0){
        await this.salesTransactionRepository.checkExistedInvoiceBeforeInsert(payload.tin, payload.bhfId, allInvo,salesTyCd+rcptTyCd);
        }
        let result: any[] = [];
        // check if data is type of Array
        if (Array.isArray(data)) {
            // loop through each item and save
            const sales = data as SalesTransaction[];
            await Promise.all(sales.map(async (sale) => {
                const status = await this.apiservice.fetch(UrlPath.SAVE_SALES, "POST", sale);
                status.data.mrcNo = payload.mrc_code ?? status.data.mrcNo;
                if (status.resultCd == "000") {
                    await this.salesTransactionRepository.createWithTransaction({ ...sale, tin: payload.tin, bhfId: payload.bhfId, response: status.data });
                    result = result ? [...result, status] : [status];
                }
                else if (status.resultCd == "924") {
                    result = result ? [...result, status] : [status];
                } else {
                    throw status;
                }
            }));
            return result;
        } else {
            const newdata: SalesTransaction = {
                tin: payload.tin,
                bhfId: payload.bhfId,
                invcNo: data.invcNo,
                orgInvcNo: data.orgInvcNo,
                custTin: data.custTin ?? data.receipt?.custTIn,
                prcOrdCd: data.prcOrdCd,
                custNm: data.custNm,
                salesTyCd: data.salesTyCd,
                rcptTyCd: data.rcptTyCd,
                pmtTyCd: data.pmtTyCd,
                salesSttsCd: data.salesSttsCd,
                cfmDt: data.cfmDt,
                salesDt: data.salesDt,
                stockRlsDt: data.stockRlsDt,
                cnclReqDt: data.cnclReqDt,
                cnclDt: data.cnclDt,
                rfdDt: data.rfdDt,
                rfdRsnCd: data.rfdRsnCd,
                totItemCnt: data.totItemCnt,
                taxblAmtA: data.taxblAmtA,
                taxblAmtB: data.taxblAmtB,
                taxblAmtC: data.taxblAmtC,
                taxblAmtD: data.taxblAmtD,
                taxRtA: data.taxRtA,
                taxRtB: data.taxRtB,
                taxRtC: data.taxRtC,
                taxRtD: data.taxRtD,
                taxAmtA: data.taxAmtA,
                taxAmtB: data.taxAmtB,
                taxAmtC: data.taxAmtC,
                taxAmtD: data.taxAmtD,
                totTaxblAmt: data.totTaxblAmt,
                totTaxAmt: data.totTaxAmt,
                totAmt: data.totAmt,
                prchrAcptcYn: data.prchrAcptcYn,
                remark: data.remark,
                regrId: data.regrId,
                regrNm: data.regrNm,
                modrId: data.modrId,
                modrNm: data.modrNm,
                receipt: {
                    ...data.receipt
                },
                itemList: data.itemList

            }
            const status = await this.apiservice.fetch(UrlPath.SAVE_SALES, "POST", newdata);
            if (status.resultCd === "000") {
                status.data.mrcNo = payload.mrc_code ?? status.data.mrcNo;
                await this.salesTransactionRepository.createWithTransaction({ ...data, tin: payload.tin, bhfId: payload.bhfId, response: status.data });
                return status;
            } else if (status.resultCd === "924") {
                throw status;
            } else {
                throw status;
            }
        }
    }
    async generateTransactionInvoice(payload: EbmSyncStatus, currentInv: InvoiceIds[], allInvo: InvoiceIds[], type: ReceiptType, rfdRsnCd?: string, freshInv?: InvoiceIds[]) {
        //   console.log(payload, type, currentInv, allInvo);
        try {
            const invoice = await this.salesTransactionRepository.getSalesTransactionByTinAndBhfIdAndTypeAndInvcNo(payload.tin, payload.bhfId, type, currentInv, allInvo, freshInv);
            // console.log(invoice);

            const savesInvcNo = [];
            if (invoice.status === 404) {
                await this.salesTransactionRepository.checkExistedInvoiceBeforeInsert(payload.tin, payload.bhfId, allInvo, type);
                for (const [index, invv] of invoice.data.entries()) {
                    // remove reponse from invv
                    const invvCopy = { ...invv } as Partial<typeof invv>;
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

                    const status = await this.apiservice.fetch(UrlPath.SAVE_SALES, "POST", { ...invvCopy });
                    status.data.mrcNo = payload.mrc_code ?? status.data.mrcNo;
                    const stockIOdata: StockInOutSave = {
                        tin: payload.tin,
                        bhfId: payload.bhfId,
                        sarNo: 0,
                        orgSarNo: 0,
                        custNm: invvCopy.custNm ?? null,
                        custTin: (invvCopy.custTin === "" ? null : invvCopy.custTin),
                        custBhfId: null,
                        ocrnDt: DateUtils.formatToYYYYMMDD(new Date()),
                        regTyCd: "A",
                        sarTyCd: "04",
                        totItemCnt: invvCopy.totItemCnt,
                        totTaxblAmt: invvCopy.totTaxblAmt,
                        totTaxAmt: invvCopy.totTaxAmt,
                        totAmt: invvCopy.totAmt,
                        regrNm: invvCopy.regrNm!,
                        regrId: invvCopy.regrId!,
                        modrNm: invvCopy.modrNm!,
                        modrId: invvCopy.modrId!,
                        itemList: invvCopy.itemList!.map(item => ({
                            itemSeq: item.itemSeq,
                            itemClsCd: item.itemClsCd,
                            itemNm: item.itemNm,
                            pkgUnitCd: item.pkgUnitCd,
                            pkg: item.pkg,
                            qtyUnitCd: item.qtyUnitCd,
                            qty: item.qty,
                            prc: item.prc,
                            splyAmt: item.splyAmt,
                            totDcAmt: item.dcAmt,
                            taxblAmt: item.taxblAmt,
                            taxTyCd: item.taxTyCd,
                            taxAmt: item.taxAmt,
                            totAmt: item.totAmt,
                        }))
                    }

                    const stockMaster = (itemCd: string, rsdQty: number, regrId?: string): SaveStockMaster => {
                        return {
                            tin: payload.tin,
                            bhfId: payload.bhfId,
                            itemCd: itemCd,
                            rsdQty: rsdQty,
                            regrId: regrId || invvCopy.regrId!,
                            regrNm: invvCopy.regrNm!,
                            modrId: invvCopy.modrId!,
                            modrNm: invvCopy.modrNm!,
                        };
                    }
                    
                    
                     await this.stockIOService.saveStockInOut(stockIOdata, payload);
                    
                    if (status.resultCd === "000") {
                        await this.salesTransactionRepository.createWithTransaction({ ...(invvCopy as SalesTransaction), response: status.data });
                        await this.stockIOService.saveStockInOut(stockIOdata, payload);
                        if(type === "NR"){
                            await Promise.all(invvCopy.itemList!.map(async (item) => {
                            const existedItem = await this.stockIOService.findStockMaster(payload, item.itemCd!);
                             await this.stockIOService.saveStockMaster(stockMaster(item.itemCd!, (existedItem ? existedItem.rsdQty : 0) + item.qty, invvCopy.regrId!), payload);
                        }));
                    }
                        
                    } else if (status.resultCd === "924") {

                        // chech existed
                        const existed = await this.salesTransactionRepository.checkInvoiceExistedWithoutType(payload.tin, payload.bhfId, invvCopy.invcNo);
                        // console.log(existed, Number(allInvo[0].invcNo) + index + 1);

                        if (!existed) {
                            await this.salesTransactionRepository.createWithTransaction({ ...(invvCopy as SalesTransaction), response: status.data });
                        }
                    } else {
                        throw status;
                    }
                }
                if (savesInvcNo.length > 0) {
                    const nDa = await this.salesTransactionRepository.getSalesTransactionByTinAndBhfIdAndTypeAndInvcNo(payload.tin, payload.bhfId, type, savesInvcNo);
                    return {
                        status: 201,
                        data: nDa.data
                    }
                }
            } else {
                return invoice;
            }

        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    // get all sales reports

    async findAllSalesReport(payload: EbmSyncStatus, startDate?: string, endDate?: string) {
        return await this.salesTransactionRepository.getAllSalesReport(payload.tin, payload.bhfId, startDate, endDate);
    }

    async findLatestInvoiceId(payload: EbmSyncStatus) {
        return await this.salesTransactionRepository.getLatestInvoiceId(payload);
    }

    async findLatestSalesTransactionId(payload: EbmSyncStatus) {
        return await this.salesTransactionRepository.getLatestSalesTransactionId(payload);
    }
}