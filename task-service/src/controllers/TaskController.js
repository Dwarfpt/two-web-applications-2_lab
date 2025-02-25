const axios = require('axios');
const config = require('../config/default');

class TaskController {
    constructor() {
        this.tasks = {
            1: { id: 1, title: 'Complete project', userId: 1, status: 'pending' },
            2: { id: 2, title: 'Review code', userId: 2, status: 'completed' }
        };
    }

    async getAllTasks(req, res) {
        try {
            console.log(`Fetching users from: ${config.usersServiceUrl}/`);
            const usersResponse = await axios.get(`${config.usersServiceUrl}/`);
            console.log('Users response:', usersResponse.data);
            const users = usersResponse.data;
            
            const tasksWithUsers = Object.values(this.tasks).map(task => ({
                ...task,
                user: users.find(u => u.id === task.userId)
            }));
            
            res.json(tasksWithUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    async getTask(req, res) {
        const task = this.tasks[req.params.id];
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        try {
            const userResponse = await axios.get(`${config.usersServiceUrl}/${task.userId}`);
            res.json({ ...task, user: userResponse.data });
        } catch (error) {
            console.error('Error fetching user:', error.message);
            res.status(500).json({ error: 'Error fetching user' });
        }
    }

    async createTask(req, res) {
        const { title, userId } = req.body;
        
        try {
            await axios.get(`${config.usersServiceUrl}/${userId}`);
            
            const id = Object.keys(this.tasks).length + 1;
            this.tasks[id] = { id, title, userId, status: 'pending' };
            res.status(201).json(this.tasks[id]);
        } catch (error) {
            console.error('Error creating task:', error.message);
            res.status(400).json({ error: 'Invalid user ID' });
        }
    }

    updateTask(req, res) {
        const id = req.params.id;
        if (!this.tasks[id]) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        this.tasks[id] = { ...this.tasks[id], ...req.body };
        res.json(this.tasks[id]);
    }

    deleteTask(req, res) {
        const id = req.params.id;
        if (!this.tasks[id]) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const task = this.tasks[id];
        delete this.tasks[id];
        res.json(task);
    }
}

module.exports = new TaskController();