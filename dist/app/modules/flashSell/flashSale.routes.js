"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleRoutes = void 0;
const express_1 = require("express");
const flashSale_controller_1 = require("./flashSale.controller");
const router = (0, express_1.Router)();
router.get('/', flashSale_controller_1.FlashSaleController.getActiveFlashSalesService);
router.post('/', flashSale_controller_1.FlashSaleController.createFlashSale);
router.delete("/remove/:productId", flashSale_controller_1.FlashSaleController.removeFromFlashSaleController);
exports.FlashSaleRoutes = router;
