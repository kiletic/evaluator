import Submission from '../models/submission';
import Task from '../models/task';
import { promises as fs } from 'fs';
import path from 'path';
import { submissionQueue } from '../app';
import langs from '../config/lang';
import util from 'util';
const exec = util.promisify(require('child_process').exec);

const CreateSubmission = async (req: any) => {
	const task: any = await Task.findOne({ _id: req.params.id });

	const submission: any = new Submission({
		userName: req.session.username,
		code: {
			content: req.body.code,
			language: req.body.language 
		},
		task: {
			id: req.params.id,
			name: task.name 
		},
		testcaseResults: []		
	});		
	await submission.save();

	const submissionPath = path.join(__dirname, `../../local/submissions/${submission.submissionId}/`);

	await fs.mkdir(submissionPath);
	await fs.appendFile(path.join(submissionPath, 'solution' + langs[req.body.language].ext), req.body.code);

	return { submission: submission, timeLimit: task.timeLimit, memoryLimit: task.memoryLimit, id: task._id };
}

const PushToQueue = async (req: any, task: any) => {
	const checkerPath: string = task.checker === 'default'
		? path.join(__dirname, '../lib/checkers/')
		: path.join(__dirname, `../../local/tasks/${task._id}`);

	if (langs[req.body.language].compile) {
		try {
			await exec(langs[req.body.language].compile('solution'), { cwd: `./local/submissions/${task.submission.submissionId}` });
		} catch(error) {
			console.log("Compile error!");
			console.log(error.stderr);

			task.submission.result = 'Compile Error';
			task.submission.save();
			return;
		}
	} 

	submissionQueue.push({...task, run: langs[req.body.language].run('solution'), checkerPath: checkerPath});
};

const Submit = async (req: any) => {
	const ret = await CreateSubmission(req);

	PushToQueue(req, ret);

	return ret.submission.submissionId;
};

const GetSubmission = async (id: number) => {
	const submission = await Submission.findOne({ submissionId : id }); 

	return submission;
};

const GetTaskSubmissionsByUsername = async (taskId: number, userName: string) => {
	return await Submission.find({ userName: userName, "task.id": taskId });
}

export { Submit, CreateSubmission, GetSubmission, GetTaskSubmissionsByUsername }; 
