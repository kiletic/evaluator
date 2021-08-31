import { execSync } from 'child_process';
import Submission from '../models/submission';
import Task from '../models/task';

const CreateSubmission = async (req: any) => {
	const task: any = await Task.findOne({ _id: req.params.id });

	const submission = new Submission({
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

	return submission;
}

const Submit = async (req: any) => {
	const submission = await CreateSubmission(req);

	try {
		execSync('c++ hello_world.cpp -o hello_world', { stdio: 'pipe', cwd: './src/lib' });
	} catch(error) {
		console.log("Compile error!");
		console.log(error.stderr.toString());
		return;
	}

	const cmd: string = './hello_world';

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

const GetSubmission = async (id: number) => {
	const submission = await Submission.findOne({ submissionId : id }); 

	return submission;
};

export { Submit, CreateSubmission, GetSubmission }; 
