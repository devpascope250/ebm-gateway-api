export interface ItemsList
 {
    id?: number;  // auto increment
    tin?: string;
    itemClsCd?: string;
    itemCd?: string;
    itemTyCd?: string;
    itemNm?: string;
    itemStdNm?: string;
    orgnNatCd?: string;
    pkgUnitCd?: string;
    qtyUnitCd?: string;
    taxTyCd?: string;
    btchNo?: string;
    regBhfId?: string;
    bcd?: string;
    dftPrc?: number;
    grpPrcL1?: number | null;
    grpPrcL2?: number | null;
    grpPrcL3?: number | null;
    grpPrcL4?: number | null;
    grpPrcL5?: number | null;
    addInfo?: string;
    sftyQty?: number | null;
    isrcAplcbYn?: string;
    rraModYn?: string;
    useYn?: string;
    createdAt?: Date
}

export interface InvoiceIds {
    invcNo: number
}