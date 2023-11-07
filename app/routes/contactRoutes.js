const express = require('express');
const controller = require('../controllers/contactController');
const { validateCreateItem } = require('../middlewares/contactMiddleware');
const { auth } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', auth, controller.getAll);

router.post('/',validateCreateItem, controller.create);

router.get('/:id', auth, controller.getById);

module.exports = router;