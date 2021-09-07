import { exec } from 'child_process';
import Submission from '../models/submission';
import Task from '../models/task';
import fs from 'fs';
import path from 'path';
import { submissionQueue } from '../app';
import langs from '../config/lang';

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

	fs.mkdirSync(submissionPath);
	fs.appendFileSync(path.join(submissionPath, 'solution' + langs[req.body.language].ext), req.body.code);

	return { submission: submission, timeLimit: task.timeLimit, memoryLimit: task.memoryLimit, id: task._id };
}

const PushToQueue = async (req: any, task: any) => {
	if (langs[req.body.language].compile) {
		exec(langs[req.body.language].compile, { cwd: `./local/submissions/${task.submission.submissionId}` }, (error, stdout, stderr) => {
			if (error) {
				console.log("Compile error!");
				console.log(stderr);

				task.submission.result = 'Compile Error';
				task.submission.save();
				return;
			}

			submissionQueue.push({...task, run: langs[req.body.language].run});
		})	
	} else {
		submissionQueue.push({...task, run: langs[req.body.language].run});
	}
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

const GetSubmissionTcRes = async (id: number) => {
	const submission: any = await GetSubmission(id);

	return submission.testcaseResults;
};

export { Submit, CreateSubmission, GetSubmission, GetSubmissionTcRes }; 
