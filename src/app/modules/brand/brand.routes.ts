import express from 'express';
import { BrandController } from './brand.controller';

const router = express.Router();

router.post('/', BrandController.addBrand);
router.get('/', BrandController.getBrandAll);
router.put('/:id', BrandController.updateBrand);
router.delete('/:id', BrandController.deleteBrand);




export const brandRoutes = router;
