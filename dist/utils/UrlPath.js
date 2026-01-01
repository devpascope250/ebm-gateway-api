"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlPath = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let base = process.env.EBM_BASE_URL;
if (process.env.ENVIRONMENT === 'sandbox') {
    base = process.env.EBM_BASE_URL_SAND;
}
if (process.env.ENVIRONMENT === 'production') {
    base = process.env.EBM_BASE_URL_PROD;
}
const environment = process.env.ENVIRONMENT;
exports.UrlPath = {
    INITIALIZATION: (environment === 'sandbox' || environment === "production") ? `${base}/selectInitVsdcInfo` : `${base}/initializer/selectInitInfo`,
    SELECT_CODE: `${base}/code/selectCodes`,
    SELECT_ITEM_CLASS: `${base}/itemClass/selectItemsClass`,
    SELECT_CUSTOMER: `${base}/customers/selectCustomer`,
    SELECT_BRANCH: `${base}/branches/selectBranches`,
    LIST_NOTICE: `${base}/notices/selectNotices`,
    SAVE_CUSTOMER_BRANCH: `${base}/branches/saveBrancheCustomers`,
    SAVE_BRANCH_USER: `${base}/branches/saveBrancheUsers`,
    SAVE_COMPANY_INSURANCE: `${base}/branches/saveBrancheInsurances`,
    SELECT_ITEMS: `${base}/items/selectItems`,
    SELECT_ITEMS_CLASSIFICATION: `${base}/itemClass/selectItemsClass`,
    SAVE_ITEMS: `${base}/items/saveItems`,
    SAVE_ITEMS_COMPOSITION: `${base}/items/saveItemComposition`, // Save Item Composition
    SELECT_IMPORT_ITEMS: `${base}/imports/selectImportItems`, // List of imported Items
    UPDATE_ITEMS_IMPORT_ITEMS: `${base}/imports/updateImportItems`,
    SAVE_SALES: `${base}/trnsSales/saveSales`,
    SELECT_TRANSACTION_PURCHASE_SALES: `${base}/trnsPurchase/selectTrnsPurchaseSales`,
    SAVE_PURCHASES: `${base}/trnsPurchase/savePurchases`,
    SAVE_STOCK_MASTER: `${base}/stockMaster/saveStockMaster`,
    SELECT_STOCK_ITEMS: `${base}/stock/selectStockItems`, // Lookup the list of stock movement
    SAVE_STOCK_ITEMS: `${base}/stock/saveStockItems`, // Save stock in/out
};
