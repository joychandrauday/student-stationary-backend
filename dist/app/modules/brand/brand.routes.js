"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
router.post('/', brand_controller_1.BrandController.addBrand);
router.get('/', brand_controller_1.BrandController.getBrandAll);
router.put('/:id', brand_controller_1.BrandController.updateBrand);
router.delete('/:id', brand_controller_1.BrandController.deleteBrand);
exports.brandRoutes = router;
