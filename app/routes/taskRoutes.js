const express = require('express');
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/taskMiddleware');

const router = express.Router();

router.get('/', taskController.getAll);

router.post('/', validateCreateTask, taskController.create);

router.get('/:id', taskController.getById);

router.patch('/:id', validateUpdateTask, taskController.update);

router.delete('/:id', taskController.delete);

module.exports = router;
