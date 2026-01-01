import { StoreNumberRecordRepository } from "../repositories/storeNumberRecordRepository";

export class StoreNumberRecordService {
    private storeNumberRecordRepository: StoreNumberRecordRepository;
    
    constructor() { 
        this.storeNumberRecordRepository = new StoreNumberRecordRepository();
    }
    
    // get next sarNo
    async getNextSarNo(tin: string, bhfId: string): Promise<number> {
        const existed = await this.storeNumberRecordRepository.checkExistedStoreNumberRecord(tin, bhfId);
        if (!existed) {
            return 1;
        }
        const nextSarNo = await this.storeNumberRecordRepository.getNextSarNo(tin, bhfId);
        return nextSarNo;
    }

    // create or update sarNo
    async createOrUpdateSarNo(tin: string, bhfId: string, sarNo: number): Promise<void> {
        const existingRecord = await this.storeNumberRecordRepository.checkExistedStoreNumberRecord(tin, bhfId);
        
        if (existingRecord) {
            await this.storeNumberRecordRepository.updateStoreNumberRecord(tin, bhfId, sarNo);
            console.log('updated');
            
        }
         else {
            // create
            console.log('created');
            await this.storeNumberRecordRepository.createStoreNumberRecord(tin, bhfId, sarNo);
        }
    }
}