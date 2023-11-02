const express = require('express');
const controller = require('../controllers/stockController');
const { validateCreateItem, validateUpdateItem } = require('../middlewares/stockMiddleware');
const { setUserData, auth } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

app.use(auth);

router.post('/', validateCreateItem, setUserData, controller.create);

router.patch('/:id', validateUpdateItem, setUserData, controller.update);

router.delete('/:id', controller.delete);

module.exports = router;
