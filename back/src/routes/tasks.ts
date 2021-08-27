import express from 'express';
import { GetTasks, GetTask } from '../controllers/tasks';; 

var router = express.Router();

router.get('/api/tasks', async (req, res) => {
	const tasks = await GetTasks();

	res.status(200).json(tasks);
});

router.get('/api/tasks/:id', async (req, res) => {
	const task = await GetTask(parseInt(req.params.id));
	
	res.status(200).json(task);
});


export default router;
