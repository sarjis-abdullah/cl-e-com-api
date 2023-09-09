const express = require('express');
const taskController = require('../controllers/userController');
const { validateLogin, validateRegistration, checkDuplicate, auth } = require('../middlewares/userMiddleware');

const router = express.Router();

router.get('/', auth, taskController.getAll);

router.post('/register', validateRegistration, checkDuplicate, taskController.register);

router.post('/login', validateLogin, taskController.login);

router.get('/:id',auth, taskController.getById);

// router.patch('/:id', validateUpdateTask, taskController.update);

router.delete('/:id',auth, taskController.delete);

module.exports = router;