export interface TaxPayerInformation {
    id?: number;  // auto increment
    tin?: string;
    taxprNm?: string;
    taxprSttsCd?: string;
    prvncNm?: string;
    dstrtNm?: string;
    sctrNm?: string;
    locDesc?: string;
    createdAt: Date;
}