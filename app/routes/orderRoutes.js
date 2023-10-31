const express = require('express');
const controller = require('../controllers/orderController');
const { orderValidationSchema } = require('../middlewares/orderMiddleware');
const { setUserData, auth } = require('../middlewares/userMiddleware');

const router = express.Router();

router.use(auth)

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', orderValidationSchema, setUserData, controller.create);

// router.patch('/:id', validateUpdateItem, setUserData, controller.update);

// router.delete('/:id', controller.delete);

module.exports = router;
