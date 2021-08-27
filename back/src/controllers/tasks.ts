import Task from '../models/task';

const GetTasks = async () => {
	const tasks = await Task.find();

	return tasks;
};

const GetTask = async (id: number) => {
	const task = await Task.find({ _id: id });

	return task;
};

export { GetTasks, GetTask };
