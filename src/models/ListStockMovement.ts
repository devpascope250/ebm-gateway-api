export interface ListStockMovement {
    id?: number;  // auto increment
    tin?: string;
    bhfId?: string;
    custTin?: string;
    custBhfId?: string;
    sarNo?: number;
    ocrnDt?: string;
    totItemCnt?: number;
    totTaxblAmt?: number;
    totTaxAmt?: number;
    totAmt?: number;
    remark?: string;
    createdAt?: Date;
    itemList?: ListStockMovementItem[];
}
export interface ListStockMovementItem {
    id?: number; // auto increment
    stockMovementId?: number; // Stock Movement Id
    itemSeq?: number;
    itemClsCd?: string;
    itemCd?: string;
    itemNm?: string;
    bcd?: string;
    pkgUnitCd?: string;
    pkg?: number;
    qtyUnitCd?: string;
    qty?: number;
    itemExprDt?: string;
    prc?: number;
    splyAmt?: number;
    totDcAmt?: number;
    taxblAmt?: number;
    taxTyCd?: string;
    taxAmt?: number;
    totAmt?: number; // duplicate column
}