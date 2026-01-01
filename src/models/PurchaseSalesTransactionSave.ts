export interface PurchaseSalesTransactionSave {
    tin: string;
    bhfId: string;
    spplrTin?: string;
    invcNo: number;
    orgInvcNo: number;
    spplrBhfId?: string;
    spplrNm?: string;
    spplrInvcN?: number;
    spplrSdcId?: string;
    regTyCd: string;
    pchsTyCd: string;
    rcptTyCd: string;
    pmtTyCd: string;
    pchsSttsCd: string;
    cfmDt?: string;
    pchsDt: string;
    wrhsDt?: string;
    cnclReqDt?: string;
    cnclDt?: string;
    rfdDt?: string;
    totItemCnt: number;
    taxblAmtA: number;
    taxblAmtB: number;
    taxblAmtC: number;
    taxblAmtD: number;
    taxRtA: number;
    taxRtB: number;
    taxRtC: number;
    taxRtD: number;
    taxAmtA: number;
    taxAmtB: number;
    taxAmtC: number;
    taxAmtD: number;
    totTaxblAmt: number;
    totTaxAmt: number;
    totAmt: number;
    remark?: string;
    regrNm: string;
    regrId: string;
    modrNm: string;
    modrId: string;
    itemList: PurchaseSalesTransactionItemSave[];
}

export interface PurchaseSalesTransactionItemSave{
    itemSeq: number;
    itemCd?: string;
    itemClsCd: string;
    itemNm: string;
    bcd?:  string;
    spplrItemClsCd?:  string;
    spplrItemCd?: string;
    spplrItemNm?: string;
    pkgUnitCd?: string;
    pkg: number;
    qtyUnitCd: string;
    qty: number;
    prc: number;
    splyAmt: number;
    dcRt: number;
    dcAmt: number;
    taxblAmt: number;
    taxTyCd: number;
    taxAmt: number; 
    totAmt: number // duplicate column
    itemExprDt?: string; 
}