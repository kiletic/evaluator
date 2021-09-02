import { execSync } from 'child_process';
import Submission from '../models/submission';
import Task from '../models/task';
import fs from 'fs';
import path from 'path';

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
	fs.appendFile(path.join(submissionPath, 'code.cpp'), req.body.code, (err) => {
		if (err) throw err;
		console.log('Successfully created new file submission.');
	});

	return submission;
}

const RunSubmission = async (req: any, submission: any) => {
	try {
		execSync('c++ hello_world.cpp -o hello_world', { stdio: 'pipe', cwd: './src/lib' });
	} catch(error) {
		console.log("Compile error!");
		console.log(error.stderr.toString());
		return;
	}

	const cmd: string = './hello_world';

	// need to get testcases
	const taskPath = path.join(__dirname, '..', '..', 'local', 'tasks', '1');

	const inputFiles = fs.readdirSync(path.join(taskPath, 'input'));
	const outputFiles = fs.readdirSync(path.join(taskPath, 'output'));
	for (var i = 0; i < inputFiles.length; i++) {
		const input = fs.readFileSync(path.join(taskPath, 'input', inputFiles[i]), 'utf8');
		const output = fs.readFileSync(path.join(taskPath, 'output', outputFiles[i]), 'utf8');
	}

	const testcases = [{"input": "1 2", "output" : "3"}, {"input": "1 4", "output" : "5"}, {"input": "1 2", "output" : "3"}];

	for (var i = 0; i < testcases.length; i++) {
		try {
			const output = execSync(cmd, { cwd: './src/lib', input: testcases[i].input }).toString();
			if (output !== testcases[i].output) {
				console.log(`Wrong answer on testcase ${i + 1}`);
				return;
			}
		} catch(error) {
			console.log(`Runtime Error on testcase ${i + 1}`);		
			return;
		}
	}

	console.log("Accepted!!!");
};

const Submit = async (req: any) => {
	const submission: any = await CreateSubmission(req);
	RunSubmission(req, submission);

	return submission.submissionId;
};

const GetSubmission = async (id: number) => {
	const submission = await Submission.findOne({ submissionId : id }); 

	return submission;
};

export { Submit, CreateSubmission, GetSubmission, RunSubmission }; 
