const express = require('express');
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../validation/task');

const router = express.Router();

router.get('/', taskController.getAllTasks);

router.post('/', validateCreateTask, taskController.createTask);

router.get('/:id', taskController.getTaskById);

router.patch('/:id', validateUpdateTask, taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
