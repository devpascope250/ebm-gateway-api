"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestProductItemCodeService = void 0;
const LatestProductItemCodeRepository_1 = require("../repositories/LatestProductItemCodeRepository");
class LatestProductItemCodeService {
    constructor() {
        this.LatestProductItemCodeRepository = new LatestProductItemCodeRepository_1.LatestProductItemCodeRepository();
    }
    async getLatestProductItemCode(payload) {
        const itemCodes = await this.LatestProductItemCodeRepository.getAllProductItemCode(payload);
        if (itemCodes.length === 0) {
            // Return default or throw error based on your needs
            return null; // or throw new Error("No item codes found");
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
exports.LatestProductItemCodeService = LatestProductItemCodeService;
