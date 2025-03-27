import { Router } from 'express';
import { FlashSaleController } from './flashSale.controller';

const router = Router();

router.get('/', FlashSaleController.getActiveFlashSalesService)

router.post(
    '/',
    FlashSaleController.createFlashSale
)
router.delete("/remove/:productId", FlashSaleController.removeFromFlashSaleController);
export const FlashSaleRoutes = router;
