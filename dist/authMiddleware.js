"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const date_time_1 = require("./utils/date-time");
const ApiKey_1 = require("./utils/ApiKey");
function authMiddleware() {
    return async (req, res, next) => {
        try {
            const ebm_token = req.headers['ebmtoken']?.split(' ')[1];
            if (!ebm_token) {
                return res.status(401).json({ message: "EBM Token Missing" });
            }
            const decrpt = ApiKey_1.ApiKey.decrypt(ebm_token);
            if (!decrpt) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.context = {
                tin: decrpt.tin,
                bhfId: decrpt.bhfId,
                clientId: decrpt.clientId,
                lastRequestDate: date_time_1.DateUtils.parse("20180523000000")
            };
            req.headers['x-custmTin'] = "100600570"; // Set a default x-custmTin header
            // const headers = {
            //   token: (req.headers['authorization'] as string)?.split(' ')[1],
            //   ebmToken: (req.headers['ebmtoken'] as string)?.split(' ')[1],
            // }
            // console.log(decrpt);
            next();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
// import { Response, Request, NextFunction } from "express";
// import { ApiKey } from './utils/ApiKey';
// import { DateUtils } from "./utils/date-time";
// export function authMiddleware() {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const apiKey = req.headers["x-api-key"];
//       if (!apiKey || typeof apiKey !== "string") {
//         return res.status(401).json({ message: "API Key Missing" });
//       }
//       let payload;
//       try {
//         payload = ApiKey.decrypt(apiKey);
//       } catch (err) {
//         return res.status(401).json({ message: "Invalid API Key" });
//       }
//       // Attach to request.context
//       req.context = {
//         tin: payload.tin,
//         bhfId: payload.bhfId,
//         clientId: payload.clientId,
//         lastRequestDate: DateUtils.parse("20200130101912") // Or payload.lastRequestDate if stored
//       };
//       next();
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
// }
