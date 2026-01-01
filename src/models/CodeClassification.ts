export interface CodeClassification {
    cdCls: string;
    cdClsNm?: string | null;
    cdClsDesc?: string | null;
    userDfnNm1?: string | null;
    userDfnNm2?: string | null;
    userDfnNm3?: string | null;
    dtlList?: dtlList[] 
    createdAt?: Date; // 
}

export interface dtlList {
    id: number; // auto increment id
    cdCls: string;
    useYn?: string | null;
    cd?: string | null;
    cdNm?: string | null;
    cdDesc?: string | null;
    srtOrd?: number | null;
    userDfnCd1?: string | null;
    userDfnCd2?: string | null;
    userDfnCd3?: string | null;
}