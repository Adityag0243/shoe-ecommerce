import { Router } from 'express';

import {
    adminMiddleware,
    authMiddleware,
} from '../../../infrastructure/middlewares/auth.middleware.js';
import {
    addProductImage,
    addReview,
    createProduct,
    deleteProduct,
    getProductById,
    getProductDescriptions,
    getProductReviews,
    getProducts,
    getProductsByAttribute,
    getProductsByBrand,
    getProductsByCategory,
    getProductsByGender,
    getRelatedShoes,
    getSimilarShoes,
    updateProduct,
} from '../services/product.service.js';

const router = Router();

router.get('/productDescriptions', getProductDescriptions);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.get('/', getProducts);
router.get('/filter/attribute', getProductsByAttribute);
router.get('/filter/brand', getProductsByBrand);
router.get('/filter/gender', getProductsByGender);
router.get('/filter/category', getProductsByCategory);
router.get('/filter/related', getRelatedShoes);
router.get('/recommend/:shoe_id', getSimilarShoes);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

router.post('/images', authMiddleware, adminMiddleware, addProductImage);

router.post('/reviews', authMiddleware, addReview);
router.get('/:id/reviews', getProductReviews);

export default router;
