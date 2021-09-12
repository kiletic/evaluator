import Submission from '../models/submission';

import { promises as fs } from 'fs';
import path from 'path';

import { submissionQueue } from '../app';
import langs from '../config/lang';
import { Compile } from '../controllers/judge';
import { GetTask } from '../controllers/tasks';

const CreateSubmission = async (req: any, task: any) => {
	const submission: any = new Submission({
		username: req.session.username,
		code: {
			content: req.body.code,
			language: req.body.language 
		},
		task: {
			id: task.taskId,
			name: task.name 
		},
		testcaseResults: []		
	});		
	await submission.save();

	const submissionPath = path.join(__dirname, `../../local/submissions/${submission.submissionId}/`);

	await fs.mkdir(submissionPath);
	await fs.writeFile(path.join(submissionPath, 'solution' + langs[req.body.language].ext), req.body.code);

	return submission; 
}

const PushToQueue = async (language: string, submissionInfo: any) => {
	const checkerPath: string = submissionInfo.checker === 'default'
		? path.join(__dirname, '../lib/checkers/')
		: path.join(__dirname, `../../local/submissionInfos/${submissionInfo.taskId}`);

	if (langs[language].compile) {
		try {
			await Compile('solution', language, `./local/submissions/${submissionInfo.submission.submissionId}`);
		} catch (error) {
			console.log("Compile error!");
			console.log(error.stderr);

			submissionInfo.submission.result = 'Compile Error';
			submissionInfo.submission.save();
			return;
		}
	} 

	submissionQueue.push({...submissionInfo, run: langs[language].run('solution'), checkerPath: checkerPath});
};

const Submit = async (req: any) => {
	const task: any = await GetTask(req.params.id);
	const submission: any = await CreateSubmission(req, task);

	PushToQueue(req.body.language, { submission: submission, timelimit: task.timelimit, memorylimit: task.memorylimit, taskId: task.taskId });

	return submission.submissionId;
};

const GetSubmission = async (id: number) => {
	const submission = await Submission.findOne({ submissionId : id }); 

	return submission;
};

const GetTaskSubmissionsByUsername = async (taskId: number, username: string) => {
	return await Submission.find({ username: username, "task.id": taskId });
}

// null -> no submissions for that task
// false -> didnt get accepted
// true -> accepted
const CheckTaskSolved = async (taskId: number, username: string) => {
	const anySubmission = await Submission.findOne({ username: username, "task.id": taskId });

	if (!anySubmission)
		return null;

	const acceptedSubmission = await Submission.findOne({ username: username, "task.id": taskId, result: 'Accepted' });

	return acceptedSubmission ? true : false;
};

export { Submit, CreateSubmission, GetSubmission, GetTaskSubmissionsByUsername, CheckTaskSolved }; 
