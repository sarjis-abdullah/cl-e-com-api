const express = require('express');
const controller = require('../controllers/userController');
const { validateLogin, validateRegistration, checkDuplicate, auth, validateUpdate } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', auth, controller.getAll);

router.post('/register', validateRegistration, checkDuplicate, controller.register);

router.post('/login', validateLogin, controller.login);

router.get('/:id',auth, controller.getById);

router.patch('/:id', validateUpdate, controller.update);

// router.delete('/:id',auth, controller.delete);

module.exports = router;