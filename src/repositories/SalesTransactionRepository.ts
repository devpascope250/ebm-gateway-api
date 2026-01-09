import { InvoiceIds } from "../models/ItemsList";
import { SalesTransaction } from "../models/SalesTransaction";
import groupByMap from "../utils/DataParse";
import { ReceiptType } from "../utils/utile-data";
import { BaseRepository, TransactionInterface } from "./BaseRepository";
import { SalesTransactionItemsRepository } from "./SalesTransactionItemsRepository";
import { SalesTransactionReceiptRepository } from "./SalesTransactionReceiptRepository";
import { SalesTransactionResponseRepository } from "./SalesTransactionResponseRepository";
import { DateUtils } from "../utils/date-time";
import { EbmSyncStatus } from "../models/EbmSyncStatus";

export class SalesTransactionRepository extends BaseRepository {
    private tableName = 'sales_transactions';
    private tableReceipt = 'sales_transactions_receipt';
    private tableTItem = 'sales_transactions_items';
    private tableResp = 'sales_transactions_response';
    private salesTransactionItemsRepository: SalesTransactionItemsRepository;
    private salesTransactionReceiptRepository: SalesTransactionReceiptRepository;
    private salesTransactionresponseRepository: SalesTransactionResponseRepository;
    constructor() {
        super();
        this.salesTransactionItemsRepository = new SalesTransactionItemsRepository();
        this.salesTransactionReceiptRepository = new SalesTransactionReceiptRepository();
        this.salesTransactionresponseRepository = new SalesTransactionResponseRepository();
    }
    async create(saleTransaction: SalesTransaction, tx?: TransactionInterface): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,invcNo,orgInvcNo,custTin,prcOrdCd,custNm,salesTyCd,rcptTyCd,pmtTyCd,salesSttsCd,cfmDt,salesDt,stockRlsDt,cnclReqDt,cnclDt,rfdDt,rfdRsnCd,totItemCnt,taxblAmtA,taxblAmtB,taxblAmtC,taxblAmtD,taxRtA,taxRtB,taxRtC,taxRtD,taxAmtA,taxAmtB,taxAmtC,taxAmtD,totTaxblAmt,totTaxAmt,totAmt,prchrAcptcYn,remark,regrNm,regrId,modrId,modrNm) VALUES (:tin,:bhfId,:invcNo,:orgInvcNo,:custTin,:prcOrdCd,:custNm,:salesTyCd,:rcptTyCd,:pmtTyCd,:salesSttsCd,:cfmDt,:salesDt,:stockRlsDt,:cnclReqDt,:cnclDt,:rfdDt,:rfdRsnCd,:totItemCnt,:taxblAmtA,:taxblAmtB,:taxblAmtC,:taxblAmtD,:taxRtA,:taxRtB,:taxRtC,:taxRtD,:taxAmtA,:taxAmtB,:taxAmtC,:taxAmtD,:totTaxblAmt,:totTaxAmt,:totAmt,:prchrAcptcYn,:remark,:regrNm,:regrId,:modrId,:modrNm)`;
        if (tx) {
            const result = await tx.queryNamed<{ insertId: number }>(sql, saleTransaction);
            return result.insertId;
        } else {
            const result = await this.queryNamed<{ insertId: number }>(sql, saleTransaction);
            return result.insertId;
        }
    }

    async getLatestInvoiceId(payload: EbmSyncStatus): Promise<number> {
        const sql = `SELECT MAX(invcNo) as maxInvoice FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { ...payload });
        return (result && result[0] && result[0].maxInvoice) ? result[0].maxInvoice : 0;
    }

    async getLatestSalesTransactionId(payload: EbmSyncStatus): Promise<number> {
        const sql = `SELECT MAX(id) as maxId FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`; 
        const result = await this.queryNamed(sql, { ...payload });
        return (result && result[0] && result[0].maxId) ? result[0].maxId : 0;
    }

    // check existed invoice before Insert
    async checkExistedInvoiceBeforeInsert(tin: string, bhfId: string, allInvo: InvoiceIds[], type: string) {
        // console.log(tin, bhfId, allInvo, type);
        const confirmedSales = await this.checkExistedInvoice(tin, bhfId, "NS", allInvo);
        const confirmedSalesRef = await this.checkExistedInvoice(tin, bhfId, "NR", allInvo);
        if (confirmedSales.length > 0) {
            if (confirmedSalesRef.length > 0) {
                if (type === "NR" ) {
                throw {
                    status: 400,
                    message: 'You can not create any transaction for Closed Invoice'
                }
            }
            }
            if (type === "NS" ) {
                throw {
                    status: 400,
                    message: 'You can not create any transaction for Closed Invoice, You can create Request For Refund Only'
                }
            }
        }
    }

    // sale whole transaction
    async createWithTransaction(saleTransaction: SalesTransaction): Promise<SalesTransaction> {
        // console.log(saleTransaction);
        
        try {
            let id;
            await this.transaction(async (tx) => {
                // const existed = await this.checkExistedInvoice(saleTransaction.tin, saleTransaction.bhfId, 'NS', allInvo);
                const salesTraId = await this.create(saleTransaction, tx);
                // insert receipt
                await this.salesTransactionReceiptRepository.create({ ...saleTransaction.receipt, sales_transactions_id: salesTraId }, tx);
                await Promise.all(saleTransaction.itemList.map(async (item) => {
                    item.sales_transactions_id = salesTraId;
                    await this.salesTransactionItemsRepository.create(item, tx);
                }));
                if (saleTransaction.response) {
                    await this.salesTransactionresponseRepository.create({ ...saleTransaction.response, sales_transactions_id: salesTraId }, tx);
                }
                id = salesTraId;
            });
            return await this.getById(id!);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<SalesTransaction> {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = :id`;
        return await this.queryNamed(sql, { id });
    }
    // get all sales transactions
    async getAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.query(sql);
        return result;
    }



    // get sales transaction by tin and bhfId

    async getSalesTransactionByTinAndBhfId(tin: string, bhfId: string) {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId`;
        const result = await this.queryNamed(sql, { tin, bhfId });
        return result;
    }

    // check invoice existed with Type
    async checkInvoiceExistedWithoutType(tin: string, bhfId: string, invcNo: number): Promise<boolean> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND invcNo = :invcNo`;
        const result = await this.queryNamed(sql, { tin, bhfId, invcNo });
        return result.length > 0;
    }

    // get sales transaction by tin and bhfId, type and invcNo

    async getSalesTransactionByTinAndBhfIdAndTypeAndInvcNo(tin: string, bhfId: string, type: ReceiptType, invcNo: InvoiceIds[], freshInvo?: InvoiceIds[], custData?: Array<{id: string, tin: string, purchaseCode: number}>) {
        console.log('Receiver: ', tin, bhfId, invcNo, custData, type);

        if (invcNo.length === 0) {
            throw {
                status: 400,
                message: 'Please click on Create More Receipt button before generate more receipt'
            }
        }

        const result = await this.checkExistedInvoice(tin, bhfId, type, invcNo);
        if (result.length === 0) {
            let data = await this.getAllInv(tin, bhfId, invcNo, type);
            if (type === 'NR') {
                if (freshInvo && freshInvo.length > 0) {
                    const resNR = await this.getAllInv(tin, bhfId, freshInvo, "NR");
                    if (resNR.length > 0) {
                        return {
                            status: 200,
                            data: resNR
                        }
                    }
                } else {
                    // console.log('echexkkkkk888**************',tin, bhfId, invcNo);
                    
                    const res = await this.getAllInv(tin, bhfId, invcNo, "NS");
                    // console.log(res, type);
                    
                    if (res.length === 0) {
                        throw ({
                            status: 400,
                            message: 'Normal Sale Invoice is not existed, You can not create Request For Refund without Normal sales Invoice.'
                        })
                    }
                    data = res;
                }

            }
            if (type === 'TR') {
                console.log(tin, bhfId, invcNo, freshInvo);  
                if (freshInvo && freshInvo.length > 0) {
                    const resTR = await this.getAllInv(tin, bhfId, freshInvo, "TR");
                    if (resTR.length > 0) {
                        return {
                            status: 200,
                            data: resTR
                        }
                    }
                } else {
                    const res = await this.getAllInv(tin, bhfId, invcNo, "TS");
                    if (res.length === 0) {
                        throw {
                            status: 400,
                            message: 'Training Sale Invoice is not existed, You can not create Request For Refund without Training sales Invoice'
                        }
                    }
                    data = res;
                }

            }
            if (data.length === 0) {
                throw {
                    status: 400,
                    message: 'Invoice is not existed, Please Create New Invoice'
                }
            }
            const newData = data.map((inv) => {
                return {
                    ...inv,
                    prcOrdCd: custData && custData.length > 0 ? custData?.find((c) => c.tin === inv.custTin)?.purchaseCode : inv.prcOrdCd
                }
            })
            return {
                status: 404,
                data: newData
            };

        } else {
            return {
                status: 200,
                data: await this.getAllInv(tin, bhfId, invcNo, type)
            };
        }
    }

    protected async getAllInv(tin: string, bhfId: string, invcNo: InvoiceIds[], type?: string, limit?: number) {
        const sql2 = `
            SELECT 
            tra.*,
            cust.sales_transactions_id as detail_customer_sales_transactions_id,
            cust.custTIn as detail_customer_custTIn,
            cust.custMblNo as detail_customer_custMblNo,
            cust.rptNo as detail_customer_rptNo,
            cust.trdeNm as detail_customer_trdeNm,
            cust.adrs as detail_customer_adrs,
            cust.topMsg as detail_customer_topMsg,
            cust.btmMsg as detail_customer_btmMsg,
            cust.prchrAcptcYn as detail_customer_prchrAcptcYn,
            itm.itemSeq as detail_itemSeq,
            itm.itemClsCd as detail_itemClsCd,
            itm.itemCd as detail_itemCd,
            itm.itemNm as detail_itemNm,
            itm.bcd as detail_bcd,
            itm.pkgUnitCd as detail_pkgUnitCd,
            itm.pkg as detail_pkg,
            itm.qtyUnitCd as detail_qtyUnitCd,
            itm.qty as detail_qty,
            itm.prc as detail_prc,
            itm.splyAmt as detail_splyAmt,
            itm.dcRt as detail_dcRt,
            itm.dcAmt as detail_dcAmt,
            itm.isrccCd as detail_isrccCd,
            itm.isrccNm as detail_isrccNm,
            itm.isrcRt as detail_isrcRt,
            itm.isrcAmt as detail_isrcAmt,
            itm.taxTyCd as detail_taxTyCd,
            itm.taxblAmt as detail_taxblAmt,
            itm.taxAmt  as detail_taxAmt,
            itm.totAmt as detail_totAmt,
            resp.sales_transactions_id as resp_sales_transactions_id,
            resp.rcptNo as resp_rcptNo,
            resp.intrlData as resp_intrlData,
            resp.rcptSign as resp_rcptSign,
            resp.totRcptNo as resp_totRcptNo,
            resp.vsdcRcptPbctDate as resp_vsdcRcptPbctDate,
            resp.sdcId as resp_sdcId,
            resp.mrcNo as resp_mrcNo
            FROM ${this.tableName} tra
            LEFT JOIN ${this.tableReceipt} cust ON tra.id = cust.sales_transactions_id
            LEFT JOIN ${this.tableTItem} itm ON tra.id = itm.sales_transactions_id
            LEFT JOIN ${this.tableResp} resp ON tra.id = resp.sales_transactions_id
            WHERE tra.tin = :tin AND tra.bhfId = :bhfId ${type ? "AND tra.salesTyCd = :salesTyCd AND tra.rcptTyCd = :rcptTyCd" : ""} AND tra.invcNo IN(:invcNo) ORDER BY tra.invcNo DESC ${limit ? `LIMIT ${limit}` : ''}`
        const condT = type ? { tin, bhfId, salesTyCd: type?.charAt(0), rcptTyCd: type?.charAt(1), invcNo: invcNo.map((i) => i.invcNo) } : { tin, bhfId, invcNo: invcNo.map((i) => i.invcNo) }
        const result2 = await this.queryNamedWithArrays(sql2, condT);
        const data = groupByMap(result2, (i: any) => i.detail_customer_sales_transactions_id);
        const nestedData = Array.from(data.entries()).map(([cdCls, items]) => {
            const firstItem = items[0];
            return {
                tin: firstItem.tin,
                bhfId: firstItem.bhfId,
                invcNo: firstItem.invcNo,
                orgInvcNo: firstItem.orgInvcNo,
                custTin: firstItem.custTin,
                prcOrdCd: firstItem.prcOrdCd,
                custNm: firstItem.custNm,
                salesTyCd: firstItem.salesTyCd,
                rcptTyCd: firstItem.rcptTyCd,
                pmtTyCd: firstItem.pmtTyCd,
                salesSttsCd: firstItem.salesSttsCd,
                cfmDt: firstItem.cfmDt,
                salesDt: firstItem.salesDt,
                stockRlsDt: firstItem.stockRlsDt,
                cnclReqDt: firstItem.cnclReqDt,
                cnclDt: firstItem.cnclDt,
                rfdDt: firstItem.rfdDt,
                rfdRsnCd: firstItem.rfdRsnCd,
                totItemCnt: firstItem.totItemCnt,
                taxblAmtA: firstItem.taxblAmtA,
                taxblAmtB: firstItem.taxblAmtB,
                taxblAmtC: firstItem.taxblAmtC,
                taxblAmtD: firstItem.taxblAmtD,
                taxRtA: firstItem.taxRtA,
                taxRtB: firstItem.taxRtB,
                taxRtC: firstItem.taxRtC,
                taxRtD: firstItem.taxRtD,
                taxAmtA: firstItem.taxAmtA,
                taxAmtB: firstItem.taxAmtB,
                taxAmtC: firstItem.taxAmtC,
                taxAmtD: firstItem.taxAmtD,
                totTaxblAmt: firstItem.totTaxblAmt,
                totTaxAmt: firstItem.totTaxAmt,
                totAmt: firstItem.totAmt,
                prchrAcptcYn: firstItem.prchrAcptcYn,
                remark: firstItem.remark,
                regrNm: firstItem.regrNm,
                regrId: firstItem.regrId,
                modrId: firstItem.modrId,
                modrNm: firstItem.modrNm,
                receipt: {
                    sales_transactions_id: firstItem.detail_customer_sales_transactions_id,
                    custTIn: firstItem.detail_customer_custTIn,
                    custMblNo: firstItem.detail_customer_custMblNo,
                    rptNo: firstItem.detail_customer_rptNo,
                    trdeNm: firstItem.detail_customer_trdeNm,
                    adrs: firstItem.detail_customer_adrs,
                    topMsg: firstItem.detail_customer_topMsg,
                    btmMsg: firstItem.detail_customer_btmMsg,
                    prchrAcptcYn: firstItem.detail_customer_prchrAcptcYn,

                },
                itemList: items.map((i) => ({
                    // sales_transactions_id: i.detail_sales_transactions_id,
                    itemSeq: i.detail_itemSeq,
                    itemClsCd: i.detail_itemClsCd,
                    itemCd: i.detail_itemCd,
                    itemNm: i.detail_itemNm,
                    bcd: i.detail_bcd,
                    pkgUnitCd: i.detail_pkgUnitCd,
                    pkg: i.detail_pkg,
                    qtyUnitCd: i.detail_qtyUnitCd,
                    qty: i.detail_qty,
                    prc: i.detail_prc,
                    splyAmt: i.detail_splyAmt,
                    dcRt: i.detail_dcRt,
                    dcAmt: i.detail_dcAmt,
                    isrccCd: i.detail_isrccCd,
                    isrccNm: i.detail_isrccNm,
                    isrcRt: i.detail_isrcRt,
                    isrcAmt: i.detail_isrcAmt,
                    taxTyCd: i.detail_taxTyCd,
                    taxblAmt: i.detail_taxblAmt,
                    taxAmt: i.detail_taxAmt,
                    totAmt: i.detail_totAmt
                })),
                response: {
                    sales_transactions_id: firstItem.resp_sales_transactions_id,
                    rcptNo: firstItem.resp_rcptNo,
                    intrlData: firstItem.resp_intrlData,
                    rcptSign: firstItem.resp_rcptSign,
                    totRcptNo: firstItem.resp_totRcptNo,
                    vsdcRcptPbctDate: firstItem.resp_vsdcRcptPbctDate,
                    sdcId: firstItem.resp_sdcId,
                    mrcNo: firstItem.resp_mrcNo
                }
            }
        });
        return nestedData;
    }


    public async getAllSalesReport(tin: string, bhfId: string, startDate?: string, endDate?: string) {
        // get to day date
        let start: Date;
        let end: Date;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            start = new Date();
            end = new Date();
        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        const startCfmDt = DateUtils.format(start);
        const endCfmDt = DateUtils.format(end);

        const sql2 = `
            SELECT 
            tra.*,
            cust.sales_transactions_id as detail_customer_sales_transactions_id,
            cust.custTIn as detail_customer_custTIn,
            cust.custMblNo as detail_customer_custMblNo,
            cust.rptNo as detail_customer_rptNo,
            cust.trdeNm as detail_customer_trdeNm,
            cust.adrs as detail_customer_adrs,
            cust.topMsg as detail_customer_topMsg,
            cust.btmMsg as detail_customer_btmMsg,
            cust.prchrAcptcYn as detail_customer_prchrAcptcYn,
            itm.itemSeq as detail_itemSeq,
            itm.itemClsCd as detail_itemClsCd,
            itm.itemCd as detail_itemCd,
            itm.itemNm as detail_itemNm,
            itm.bcd as detail_bcd,
            itm.pkgUnitCd as detail_pkgUnitCd,
            itm.pkg as detail_pkg,
            itm.qtyUnitCd as detail_qtyUnitCd,
            itm.qty as detail_qty,
            itm.prc as detail_prc,
            itm.splyAmt as detail_splyAmt,
            itm.dcRt as detail_dcRt,
            itm.dcAmt as detail_dcAmt,
            itm.isrccCd as detail_isrccCd,
            itm.isrccNm as detail_isrccNm,
            itm.isrcRt as detail_isrcRt,
            itm.isrcAmt as detail_isrcAmt,
            itm.taxTyCd as detail_taxTyCd,
            itm.taxblAmt as detail_taxblAmt,
            itm.taxAmt  as detail_taxAmt,
            itm.totAmt as detail_totAmt
            FROM ${this.tableName} tra
            LEFT JOIN ${this.tableReceipt} cust ON tra.id = cust.sales_transactions_id
            LEFT JOIN ${this.tableTItem} itm ON tra.id = itm.sales_transactions_id
            WHERE tra.tin = :tin AND tra.bhfId = :bhfId AND tra.cfmDt BETWEEN :startCfmDt AND :endCfmDt ORDER BY tra.invcNo DESC`;
        const result2 = await this.queryNamed(sql2, { tin, bhfId, startCfmDt, endCfmDt });
        const data = groupByMap(result2, (i: any) => i.detail_customer_sales_transactions_id);
        const nestedData = Array.from(data.entries()).map(([cdCls, items]) => {
            const firstItem = items[0];
            return {
                tin: firstItem.tin,
                bhfId: firstItem.bhfId,
                invcNo: firstItem.invcNo,
                orgInvcNo: firstItem.orgInvcNo,
                custTin: firstItem.custTin,
                prcOrdCd: firstItem.prcOrdCd,
                custNm: firstItem.custNm,
                salesTyCd: firstItem.salesTyCd,
                rcptTyCd: firstItem.rcptTyCd,
                pmtTyCd: firstItem.pmtTyCd,
                salesSttsCd: firstItem.salesSttsCd,
                cfmDt: firstItem.cfmDt,
                salesDt: firstItem.salesDt,
                stockRlsDt: firstItem.stockRlsDt,
                cnclReqDt: firstItem.cnclReqDt,
                cnclDt: firstItem.cnclDt,
                rfdDt: firstItem.rfdDt,
                rfdRsnCd: firstItem.rfdRsnCd,
                totItemCnt: firstItem.totItemCnt,
                taxblAmtA: firstItem.taxblAmtA,
                taxblAmtB: firstItem.taxblAmtB,
                taxblAmtC: firstItem.taxblAmtC,
                taxblAmtD: firstItem.taxblAmtD,
                taxRtA: firstItem.taxRtA,
                taxRtB: firstItem.taxRtB,
                taxRtC: firstItem.taxRtC,
                taxRtD: firstItem.taxRtD,
                taxAmtA: firstItem.taxAmtA,
                taxAmtB: firstItem.taxAmtB,
                taxAmtC: firstItem.taxAmtC,
                taxAmtD: firstItem.taxAmtD,
                totTaxblAmt: firstItem.totTaxblAmt,
                totTaxAmt: firstItem.totTaxAmt,
                totAmt: firstItem.totAmt,
                prchrAcptcYn: firstItem.prchrAcptcYn,
                remark: firstItem.remark,
                regrNm: firstItem.regrNm,
                regrId: firstItem.regrId,
                modrId: firstItem.modrId,
                modrNm: firstItem.modrNm,
                receipt: {
                    sales_transactions_id: firstItem.detail_customer_sales_transactions_id,
                    custTIn: firstItem.detail_customer_custTIn,
                    custMblNo: firstItem.detail_customer_custMblNo,
                    rptNo: firstItem.detail_customer_rptNo,
                    trdeNm: firstItem.detail_customer_trdeNm,
                    adrs: firstItem.detail_customer_adrs,
                    topMsg: firstItem.detail_customer_topMsg,
                    btmMsg: firstItem.detail_customer_btmMsg,
                    prchrAcptcYn: firstItem.detail_customer_prchrAcptcYn,

                },
                itemList: items.map((i) => ({
                    // sales_transactions_id: i.detail_sales_transactions_id,
                    itemSeq: i.detail_itemSeq,
                    itemClsCd: i.detail_itemClsCd,
                    itemCd: i.detail_itemCd,
                    itemNm: i.detail_itemNm,
                    bcd: i.detail_bcd,
                    pkgUnitCd: i.detail_pkgUnitCd,
                    pkg: i.detail_pkg,
                    qtyUnitCd: i.detail_qtyUnitCd,
                    qty: i.detail_qty,
                    prc: i.detail_prc,
                    splyAmt: i.detail_splyAmt,
                    dcRt: i.detail_dcRt,
                    dcAmt: i.detail_dcAmt,
                    isrccCd: i.detail_isrccCd,
                    isrccNm: i.detail_isrccNm,
                    isrcRt: i.detail_isrcRt,
                    isrcAmt: i.detail_isrcAmt,
                    taxTyCd: i.detail_taxTyCd,
                    taxblAmt: i.detail_taxblAmt,
                    taxAmt: i.detail_taxAmt,
                    totAmt: i.detail_totAmt
                }))
            }
        });
        return nestedData;
    }

    protected async checkExistedInvoice(tin: string, bhfId: string, type: string, invcNo: InvoiceIds[]) {
        const salesTyCd = type.charAt(0);
        const rcptTyCd = type.charAt(1);
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND bhfId = :bhfId AND salesTyCd = :salesTyCd AND rcptTyCd = :rcptTyCd AND invcNo IN(:invcNo)`;
        const result = await this.queryNamedWithArrays(sql, { tin, bhfId, salesTyCd, rcptTyCd, invcNo: invcNo.map((i) => i.invcNo) });
        return result;
    }
}