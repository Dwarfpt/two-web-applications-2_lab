const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Определяем маршруты для задач
router.get('/', TaskController.getAllTasks.bind(TaskController));
router.get('/:id', TaskController.getTask.bind(TaskController));
router.post('/', TaskController.createTask.bind(TaskController));
router.put('/:id', TaskController.updateTask.bind(TaskController));
router.delete('/:id', TaskController.deleteTask.bind(TaskController));

module.exports = router;