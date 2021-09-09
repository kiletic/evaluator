import express from 'express';
import { GetTasks, GetTask, SaveTask } from '../controllers/tasks';; 
import { SaveTaskIO, SaveAndCompileChecker, SaveSolution, CreateTaskDir } from '../lib/utils';
import path from 'path';

var router = express.Router();

router.get('/api/tasks', async (req, res) => {
	const tasks = await GetTasks();

	res.status(200).json(tasks);
});

router.get('/api/tasks/:id', async (req, res) => {
	const task = await GetTask(parseInt(req.params.id));
	
	res.status(200).json(task);
});

router.post('/api/tasks/add', async (req, res) => {
	const task: any = await SaveTask(req.body); 

	await CreateTaskDir(task.taskId);

	if (req.body.checker) {
		const err = await SaveAndCompileChecker(task.taskId, req.body.checker.code);
		if (err) {
			console.log("SaveAndCompile returned error.");
			console.log(err);
		}
	}

	// Save testcases
	SaveTaskIO(task.taskId, req.body.testcases)

	// Save solution
	SaveSolution(task.taskId, req.body.solution.code, req.body.solution.language);	
})


export default router;
