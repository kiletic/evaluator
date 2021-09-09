import Task from '../models/task';
import path from 'path';
import { promises as fs } from 'fs';

const tasksPath: string = path.join(__dirname, '..', '..', 'local', 'tasks') 

const GetTasks = async () => {
	const tasks = await Task.find();

	return tasks;
};

const GetTask = async (id: number) => {
	const task = await Task.findOne({ taskId: id });

	return task;
};

const SaveTask = async (task: any) => {
	const testcases: Array<any> = [];
	for (var i = 0; i < task.testcases.length; i++) {
		const testcase = task.testcases[i];

		if (testcase.sample) {
			testcases.push({
				input: testcase.input,
				output: testcase.output,
				note: testcase.note
			});
		}
	}

	const newTask = new Task({
		name: task.name,
		text: task.statement,
		inputText: task.input,
		outputText: task.output,
		timeLimit: parseInt(task.timelimit),
		memoryLimit: parseInt(task.memorylimit),
		testcases: testcases
	});
	await newTask.save();

	return newTask;
}

const CreateTaskDir = async (taskId: number) => {
	const taskPath: string = path.join(tasksPath, `${taskId}`);

	fs.mkdir(taskPath);
};

export { GetTasks, GetTask, SaveTask, CreateTaskDir };
