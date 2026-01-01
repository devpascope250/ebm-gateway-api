import express from 'express';
import { fetch } from 'undici';
import cors from 'cors';
import helmet from 'helmet';
// include dotenv
import redisCache from './utils/redisCache';
import { config } from 'dotenv';
import { authMiddleware } from './authMiddleware';
import initializationRoute from './routes/InitializationRoute';
import codeClass from "./routes/CodeClassificationRoute";
import items from "./routes/ItemRoute";
import itemClassifications from "./routes/ItemClassificationRoute";
import selectCustomers from "./routes/TaxPayerInformationRoute";
import selectBranches from "./routes/TaxPayerBranchInformationRoute";
import selectNotice from "./routes/ListNoticeRoute";
import saveCustomerBranch from "./routes/SaveCustomerBranchRoute";
import saveBranchUserAccount from "./routes/SaveBranchUserRoute";
import saveCompanyInsurance from "./routes/SaveCompanyInsuranceRoute";
import importItemSave from "./routes/ImportItemSaveRoute";
import salesTransactions from "./routes/SalesTransactionsRoute";
import purchaseSalesTransactions from "./routes/PurchaseSalesTransactionRoute";
import stockInformation from "./routes/StockInformationRoute";
import { CacheHeaderAuditor } from './utils/CacheHeaderAuditor';
import { globalLimiter } from './middlewares/security/rateLimiter';
config();
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5000','http://10.0.2.2:5000'], // Add your frontend URLs here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Allow cookies to be sent
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-custmTin','ebmtoken']
}));

app.set("trust proxy", 1); // trust first proxy for IP when behind a reverse proxy
app.use(globalLimiter);
app.use(helmet({
  contentSecurityPolicy: false, // APIs don't need CSP unless serving frontend
  referrerPolicy: { policy: 'no-referrer' }, // safer for API, avoid leaking origin
  frameguard: { action: 'deny' },            // good: block clickjacking
  hidePoweredBy: true,                       // good: hide Express info
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // good: enforce HTTPS
  noSniff: true,                             // good: prevent MIME-type sniffing
  ieNoOpen: true,                            // good: block content download in IE
  dnsPrefetchControl: { allow: false },      // prevent DNS prefetch leaks
  permittedCrossDomainPolicies: { permittedPolicies: "none" } // block Flash-like embedding
}));
app.use(authMiddleware());
app.use('/', initializationRoute);
app.use('/', codeClass);
app.use('/', items);
app.use('/', itemClassifications);
app.use('/', selectCustomers);
app.use('/', selectBranches);
app.use('/', selectNotice);
app.use('/', saveCustomerBranch);
app.use('/', saveBranchUserAccount);
app.use('/', saveCompanyInsurance);
app.use('/', importItemSave);
app.use('/', salesTransactions);
app.use('/', purchaseSalesTransactions);
app.use('/', stockInformation);


const auditor = new CacheHeaderAuditor();
app.use(auditor.auditMiddleware());

// Later, get reports
app.get('/admin/cache-report', (req, res) => {
  res.json(auditor.getReports());
});


(async () => {
  try {
    await redisCache.connect(); console.log('Redis connected successfully');
    app.listen(4000, () => {
      console.log(`Server running on port ${4000}`);
    });
  } catch (error) {
    console.error('Failed to start server due to Redis error:', error); process.exit(1);
  }
})();



// {"tin":"999000240","bhfId":"00","dvcSrlNo":"corebasewartest"}