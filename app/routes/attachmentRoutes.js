const express = require('express');
const controller = require('../controllers/attachmentController');
const { validateCreateItem, validateUpdateItem } = require('../middlewares/attachmentMiddleware');

const router = express.Router();

router.get('/', controller.getAll);

router.post('/', validateCreateItem, controller.create);

router.get('/:id', controller.getById);

router.patch('/:id', validateUpdateItem, controller.update);

router.delete('/:id', controller.delete);

module.exports = router;
