"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializationController = void 0;
const InitializationService_1 = require("../services/InitializationService");
class InitializationController {
    constructor() {
        this.initialize = async (req, res) => {
            try {
                const result = await this.initalizationService.initialize(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error ?? { error: "Initialization failed", details: error });
            }
        };
        this.initalizationService = new InitializationService_1.InitializaionService();
    }
}
exports.InitializationController = InitializationController;
