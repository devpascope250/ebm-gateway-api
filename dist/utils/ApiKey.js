"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const SECRET = process.env.API_SECRET || "s09N5rJHBOwLzyrZRbgoDAsn86qrmsXZ";
class ApiKey {
    static generate(tin, bhfId, clientId) {
        const payload = {
            tin,
            bhfId,
            clientId,
            iat: Math.floor(Date.now() / 1000)
        };
        const json = JSON.stringify(payload);
        // AES-256-GCM encryption
        const iv = crypto_1.default.randomBytes(12); // GCM recommended IV size
        const cipher = crypto_1.default.createCipheriv("aes-256-gcm", Buffer.from(SECRET), iv);
        let encrypted = cipher.update(json, "utf8", "base64url");
        encrypted += cipher.final("base64url");
        const authTag = cipher.getAuthTag().toString("base64url");
        return `${iv.toString("base64url")}.${encrypted}.${authTag}`;
    }
    static decrypt(apiKey) {
        try {
            // Check if API key is provided
            if (!apiKey || typeof apiKey !== 'string') {
                throw new Error('API key is required and must be a string');
            }
            const parts = apiKey.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid API Key format: expected iv.encryptedData.authTag');
            }
            const [ivBase, encrypted, tagBase] = parts;
            // Validate base64url encoding
            if (!ivBase || !encrypted || !tagBase) {
                throw new Error('Invalid API Key: missing components');
            }
            const iv = Buffer.from(ivBase, 'base64url');
            const authTag = Buffer.from(tagBase, 'base64url');
            // Validate IV and auth tag sizes for AES-256-GCM
            if (iv.length !== 12) {
                throw new Error(`Invalid IV length: expected 12 bytes, got ${iv.length}`);
            }
            if (authTag.length !== 16) {
                throw new Error(`Invalid auth tag length: expected 16 bytes, got ${authTag.length}`);
            }
            const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', Buffer.from(SECRET), iv);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encrypted, 'base64url', 'utf8');
            decrypted += decipher.final('utf8');
            const parsedData = JSON.parse(decrypted);
            // Validate the decrypted data structure
            if (!parsedData.tin || !parsedData.bhfId || !parsedData.clientId || !parsedData.iat) {
                throw new Error('Decrypted data missing required fields');
            }
            return parsedData;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`API Key decryption failed: ${error.message}`);
            }
            throw new Error('API Key decryption failed: Unknown error');
        }
    }
}
exports.ApiKey = ApiKey;
// const key = ApiKey.generate("999000240", "00", "CLIENT123");
// console.log("API_KEY:", key);
