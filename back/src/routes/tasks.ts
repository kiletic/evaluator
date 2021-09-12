import express from 'express';
import { GetTasks, GetTask, SaveTask, CreateTaskDir } from '../controllers/tasks';
import { CheckTaskSolved } from '../controllers/submit';
import { SaveTaskIO, SaveAndCompileChecker, SaveSolution } from '../utils';

var router = express.Router();

router.get('/api/tasks', async (req: any, res: any) => {
	var tasks: Array<any> = await GetTasks();

	tasks = await Promise.all(tasks.map(async task => {
		const solvedStatus: boolean | null = await CheckTaskSolved(task.taskId, req.session.username);

		if (solvedStatus === true) {
			return {...task.toJSON(), solved: true };
		} else if (solvedStatus === false) {
			return {...task.toJSON(), solved: false };
		} else {
			return task.toJSON();
		}
	}));

	res.json(tasks);
});

router.get('/api/tasks/:id', async (req, res) => {
	const task = await GetTask(parseInt(req.params.id));
	
	res.json(task);
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
