import { execSync } from 'child_process';
import Submission from '../models/submission';
import Task from '../models/task';
import fs from 'fs';
import path from 'path';
import { submissionQueue } from '../app';

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
	fs.appendFileSync(path.join(submissionPath, 'solution.cpp'), req.body.code);

	return { submission: submission, timeLimit: task.timeLimit, memoryLimit: task.memoryLimit, id: task._id };
}

const PushToQueue = async (task: any) => {
	try {
		execSync('c++ solution.cpp -O3 -o solution', { stdio: 'pipe', cwd: `./local/submissions/${task.submission.submissionId}`});
		submissionQueue.push(task);
	} catch(error) {
		console.log("Compile error!");
		console.log(error.stderr.toString());

		task.submission.result = 'Compile Error';
		task.submission.save();
		return;
	}
};

const Submit = async (req: any) => {
	const ret = await CreateSubmission(req);

	PushToQueue(ret);

	return ret.submission.submissionId;
};

const GetSubmission = async (id: number) => {
	const submission = await Submission.findOne({ submissionId : id }); 

	return submission;
};

export { Submit, CreateSubmission, GetSubmission }; 
