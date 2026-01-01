import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { LatestProductItemCodeRepository } from "../repositories/LatestProductItemCodeRepository";
interface ItemCd {
    itemCd: string
} 
export class LatestProductItemCodeService {
    private LatestProductItemCodeRepository: LatestProductItemCodeRepository;
    constructor() {
        this.LatestProductItemCodeRepository = new LatestProductItemCodeRepository();
    }
    async getLatestProductItemCode(payload: EbmSyncStatus): Promise<any> {
    const itemCodes = await this.LatestProductItemCodeRepository.getAllProductItemCode(payload);
    
    if (itemCodes.length === 0) {
        // Return default or throw error based on your needs
        return null  // or throw new Error("No item codes found");
    }
    
    // Extract the numeric part (last 7 digits) from each item code
    const numericValues = itemCodes.map(item => {
        const code = item.itemCd;
        // Get the last 7 characters (assuming they're always numeric)
        const numericPart = code.slice(-7);
        return {
            originalCode: code,
            numericValue: parseInt(numericPart, 10)
        };
    });
    
    // Find the maximum numeric value
    const maxItem = numericValues.reduce((max, current) => {
        return current.numericValue > max.numericValue ? current : max;
    });
    
    // Return just the item code string
    return maxItem.originalCode.slice(-7);
}
}