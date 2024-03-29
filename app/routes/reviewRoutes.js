const express = require('express');
const controller = require('../controllers/reviewController');
const { validateCreateItem, validateUpdateItem } = require('../middlewares/reviewMiddleware');
const { setUserData } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', controller.getAll);

router.post('/', validateCreateItem, setUserData, controller.create);

router.get('/:id', controller.getById);

router.patch('/:id', validateUpdateItem, setUserData, controller.update);

router.delete('/:id', controller.delete);

module.exports = router;
