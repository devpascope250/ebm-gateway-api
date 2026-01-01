"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeClassificationController = void 0;
const CodeClassificationService_1 = require("../services/CodeClassificationService");
class CodeClassificationController {
    constructor() {
        this.getAllCodeClassification = async (req, res) => {
            const { tin, bhfId, lastRequestDate } = req.context;
            const codeClassificationService = new CodeClassificationService_1.CodeClassificationService(tin, bhfId, lastRequestDate);
            try {
                const codeClassification = await codeClassificationService.getAll();
                res.status(200).json(codeClassification);
            }
            catch (error) {
                res.status(500).json({ message: error ?? "Error" });
            }
        };
        this.getCodeClassificationByCdCls = async (req, res) => {
            const { tin, bhfId, lastRequestDate } = req.context;
            const codeClassificationService = new CodeClassificationService_1.CodeClassificationService(tin, bhfId, lastRequestDate);
            try {
                const codeClassification = await codeClassificationService.getBycdCls(req.params.cdCls);
                res.status(200).json(codeClassification);
            }
            catch (error) {
                res.status(500).json({ message: error ?? "Error" });
            }
        };
        this.getAllClassification = async (req, res) => {
            const { tin, bhfId, lastRequestDate } = req.context;
            const codeClassificationService = new CodeClassificationService_1.CodeClassificationService(tin, bhfId, lastRequestDate);
            try {
                const codeClassification = await codeClassificationService.getAllClassification();
                res.status(200).json(codeClassification);
            }
            catch (error) {
                res.status(500).json({ message: error ?? "Error" });
            }
        };
        this.getCodeListByCdCls = async (req, res) => {
            const { tin, bhfId, lastRequestDate } = req.context;
            const codeClassificationService = new CodeClassificationService_1.CodeClassificationService(tin, bhfId, lastRequestDate);
            try {
                const codeClassification = await codeClassificationService.getCodeList(req.params.cdCls);
                res.status(200).json(codeClassification);
            }
            catch (error) {
                res.status(500).json({ message: error ?? "Error" });
            }
        };
        this.getCodeClassificationByCdClNm = async (req, res) => {
            const { tin, bhfId, lastRequestDate } = req.context;
            const codeClassificationService = new CodeClassificationService_1.CodeClassificationService(tin, bhfId, lastRequestDate);
            const searchQuery = req.query.query;
            try {
                const codeClassification = await codeClassificationService.getCodeListByCdClsNm(req.params.cdClNm === "StockIOType" ? "Stock I/O Type" : req.params.cdClNm, searchQuery);
                res.status(200).json(codeClassification);
            }
            catch (error) {
                res.status(500).json({ message: error ?? "Error" });
            }
        };
    }
}
exports.CodeClassificationController = CodeClassificationController;
