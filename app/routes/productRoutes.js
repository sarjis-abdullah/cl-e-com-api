const express = require('express');
const productController = require('../controllers/productController');
const { validateCreateItem, validateUpdateItem } = require('../middlewares/productMiddleware');
const { setUserData } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', productController.getAll);

router.post('/', validateCreateItem, setUserData, productController.create);

router.get('/:id', productController.getById);

router.patch('/:id', validateUpdateItem, setUserData, productController.update);

router.delete('/:id', productController.delete);

module.exports = router;
