//  {"tin": "999000099", "taxprNm": "TEST VSDC","bsnsActv": "TESTING ","bhfId": "00","bhfNm": "Headquarter","bhfOpenDt": "20210214","prvncNm": "KIGALI CITY","dstrtNm": "GASABO","sctrNm
// ": "JALI","locDesc": "KN 5 St.","hqYn": "Y","mgrNm": "Minsoo","mgrTelNo": "0780000000","mgrEmail": "test@gaoin.kr","sdcId": null,"mrcNo": null,"dvcId": "9990000997006310","intrlKey":null,"signKey": null
// ,"cmcKey":null,"lastPchsInvcNo": 0,"lastSaleRcptNo":0,"lastInvcNo": null,"lastSaleInvcNo": 0,"lastTrainInvcNo":null,"lastProfrmInvcNo": null,"lastCopyInvcNo": null
//  }

export interface InitFirst{
    tin?: string;
    bhfId?: string;
    lastReqDt?: string;
}

export interface InitInfoRes {
    id: number;                    // for auto increment
    clientId: string;              // length 255
    tin?: string;                  // length 9
    taxprNm?: string;               // length 60
    bsnsActv?: string;             // length 100
    bhfId?: string;                 // length 2
    bhfNm?: string;                 // length 60
    bhfOpenDt?: string;             // length  8 
    prvncNm?: string;               // lentgh 100
    dstrtNm?: string;                // length 100
    sctrNm?: string;                 // lengt  100
    locDesc?: string;                // length 100
    hqYn?: string;
    mgrNm?: string;
    mgrTelNo?: string;
    mgrEmail?: string;
    sdcId?: string;
    mrcNo?: string;
    dvcId?: string;
    intrlKey?: string;
    signKey?: string;
    cmcKey?: string;
    lastSaleInvcNo?: number;
    lastPchsInvcNo?: number;
    lastSaleRcptNo?: number;
    lastInvcNo?: number;
    lastTrainInvcNo?: number;
    lastProfrmInvcNo?: number;
    lastCopyInvcNo?: number
    createdAt: Date; // auto generated
}