const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Добавляем middleware для обработки JSON

// Используем роутер для /tasks
app.use('/tasks', tasksRouter);

app.listen(port, () => {
    console.log(`Task service listening at http://localhost:${port}`);
});