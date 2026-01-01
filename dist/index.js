"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// include dotenv
const dotenv_1 = require("dotenv");
const authMiddleware_1 = require("./authMiddleware");
const InitializationRoute_1 = __importDefault(require("./routes/InitializationRoute"));
const CodeClassificationRoute_1 = __importDefault(require("./routes/CodeClassificationRoute"));
const ItemRoute_1 = __importDefault(require("./routes/ItemRoute"));
const ItemClassificationRoute_1 = __importDefault(require("./routes/ItemClassificationRoute"));
const TaxPayerInformationRoute_1 = __importDefault(require("./routes/TaxPayerInformationRoute"));
const TaxPayerBranchInformationRoute_1 = __importDefault(require("./routes/TaxPayerBranchInformationRoute"));
const ListNoticeRoute_1 = __importDefault(require("./routes/ListNoticeRoute"));
const SaveCustomerBranchRoute_1 = __importDefault(require("./routes/SaveCustomerBranchRoute"));
const SaveBranchUserRoute_1 = __importDefault(require("./routes/SaveBranchUserRoute"));
const SaveCompanyInsuranceRoute_1 = __importDefault(require("./routes/SaveCompanyInsuranceRoute"));
const ImportItemSaveRoute_1 = __importDefault(require("./routes/ImportItemSaveRoute"));
const SalesTransactionsRoute_1 = __importDefault(require("./routes/SalesTransactionsRoute"));
const PurchaseSalesTransactionRoute_1 = __importDefault(require("./routes/PurchaseSalesTransactionRoute"));
const StockInformationRoute_1 = __importDefault(require("./routes/StockInformationRoute"));
const testing_1 = require("./models/testing");
const DataParse_1 = __importDefault(require("./utils/DataParse"));
const CacheHeaderAuditor_1 = require("./utils/CacheHeaderAuditor");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://10.0.2.2:5000'], // Add your frontend URLs here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-custmTin', 'ebmtoken']
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // APIs don't need CSP unless serving frontend
    referrerPolicy: { policy: 'no-referrer' }, // safer for API, avoid leaking origin
    frameguard: { action: 'deny' }, // good: block clickjacking
    hidePoweredBy: true, // good: hide Express info
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // good: enforce HTTPS
    noSniff: true, // good: prevent MIME-type sniffing
    ieNoOpen: true, // good: block content download in IE
    dnsPrefetchControl: { allow: false }, // prevent DNS prefetch leaks
    permittedCrossDomainPolicies: { permittedPolicies: "none" } // block Flash-like embedding
}));
app.use((0, authMiddleware_1.authMiddleware)());
app.use('/', InitializationRoute_1.default);
app.use('/', CodeClassificationRoute_1.default);
app.use('/', ItemRoute_1.default);
app.use('/', ItemClassificationRoute_1.default);
app.use('/', TaxPayerInformationRoute_1.default);
app.use('/', TaxPayerBranchInformationRoute_1.default);
app.use('/', ListNoticeRoute_1.default);
app.use('/', SaveCustomerBranchRoute_1.default);
app.use('/', SaveBranchUserRoute_1.default);
app.use('/', SaveCompanyInsuranceRoute_1.default);
app.use('/', ImportItemSaveRoute_1.default);
app.use('/', SalesTransactionsRoute_1.default);
app.use('/', PurchaseSalesTransactionRoute_1.default);
app.use('/', StockInformationRoute_1.default);
app.get('/', async (req, res) => {
    const databoddy = {
        "tin": "999000240",
        "bhfId": "00",
        "dvcSrlNo": "corebasewartest"
    };
    try {
        // const respo = await fetch('http://localhost:8080/rraVsdcSandBox2.1.2.3.8PC/initializer/selectInitInfo', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(databoddy)
        // });
        // const data = await respo.json();
        const data = (0, DataParse_1.default)(testing_1.TestingData, item => item.cdCls);
        const nestedData = Array.from(data.entries()).map(([cdCls, items]) => {
            const firstItem = items[0];
            return {
                cdCls: firstItem.cdCls,
                cdClsNm: firstItem.cdClsNm,
                cdClsDesc: firstItem.cdClsDesc,
                userDfnNm1: firstItem.userDfnNm1,
                userDfnNm2: firstItem.userDfnNm2,
                userDfnNm3: firstItem.userDfnNm3,
                dtlList: items.map(item => ({
                    id: item.detail_id,
                    cdCls: item.detail_cdCls,
                    useYn: item.detail_useYn,
                    cd: item.detail_cd,
                    cdNm: item.detail_cdNm,
                    cdDesc: item.detail_cdDesc,
                    srtOrd: item.detail_srtOrd,
                    userDfnCd1: item.detail_userDfnCd1,
                    userDfnCd2: item.detail_userDfnCd2,
                    userDfnCd3: item.detail_userDfnCd3,
                }))
            };
        });
        res.send(nestedData);
    }
    catch (error) {
        console.error("Error in root route:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
});
const auditor = new CacheHeaderAuditor_1.CacheHeaderAuditor();
app.use(auditor.auditMiddleware());
// Later, get reports
app.get('/admin/cache-report', (req, res) => {
    res.json(auditor.getReports());
});
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
// {"tin":"999000240","bhfId":"00","dvcSrlNo":"corebasewartest"}
