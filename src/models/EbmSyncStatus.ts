export interface EbmSyncStatus {
    id?: number;
    tin: string;
    bhfId: string;
    clientId: string;
    lastRequestDate?: Date;
    mrc_code?: string;
}