const express = require('express');
const taskController = require('../controllers/userController');
const { validateLogin, validateRegistration, checkDuplicate } = require('../middlewares/user');

const router = express.Router();

router.get('/', taskController.getAll);

router.post('/register', validateRegistration, checkDuplicate, taskController.register);

router.post('/login', validateLogin, taskController.login);

router.get('/:id', taskController.getById);

// router.patch('/:id', validateUpdateTask, taskController.update);

router.delete('/:id', taskController.delete);

module.exports = router;