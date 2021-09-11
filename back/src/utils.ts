import { promises as fs } from 'fs';
import path from 'path';
import langs from './config/lang';
import util from 'util';
const exec = util.promisify(require('child_process').exec);

const submissionsPath: string = path.join(__dirname, '..', 'local', 'submissions');
const tasksPath: string = path.join(__dirname, '..', 'local', 'tasks') 

const GetSubmissionCode = async (submissionId: number) => {
	return await fs.readFile(path.join(submissionsPath, `${submissionId}`, 'solution.cpp'));
};

const GetTestcaseResults = async (submissionId: number, testcases: any, taskId: number) => {
	const ret: Array<any> = [];
	for (var i = 0; i < testcases.length; i++) {
		var inp: string = await fs.readFile(path.join(tasksPath, `${taskId}`, 'input', `${i + 1}.in`), { encoding: 'utf-8' });
		var out: string = await fs.readFile(path.join(submissionsPath, `${submissionId}`, `${testcases[i].output}`), { encoding: 'utf-8' });

		if (inp.length > 100) {
			inp = inp.substr(0, 100) + '...';
		}

		if (out.length > 100) {
			out = out.substr(0, 100) + '...';
		}

		ret.push({ 
			verdict: testcases[i].verdict,
			input: inp, 
			output: out 
		})		
	}	

	return ret;
}; 

const SaveTaskIO = async (taskId: number, testcases: Array<any>) => {
	const taskPath: string = path.join(tasksPath, `${taskId}`);	

	console.log("HERE");

	await fs.mkdir(path.join(taskPath, 'input'));
	await fs.mkdir(path.join(taskPath, 'output'));

	for (var i = 0; i < testcases.length; i++) {
		await fs.writeFile(path.join(taskPath, 'input', `${i + 1}.in`), testcases[i].input);
		await fs.writeFile(path.join(taskPath, 'output', `${i + 1}.out`), testcases[i].output);
	}
};

const SaveAndCompileChecker = async (taskId: number, code: string) => {
	const taskPath: string = path.join(tasksPath, `${taskId}`);
	await fs.writeFile(path.join(taskPath, 'checker.cpp'), code);		

	const { error, stderr } = await exec(langs['c_cpp'].compile('checker') + ' -I /lib/checkers/', { cwd: taskPath });					

	if (error) {
		return stderr;
	}

	return null;
};

const SaveSolution = async (taskId: number, code: string, language: string) => {
	const taskPath: string = path.join(tasksPath, `${taskId}`);

	fs.writeFile(path.join(taskPath, 'solution' + langs[language].ext), code);		
}

export { GetSubmissionCode, GetTestcaseResults, SaveTaskIO, SaveAndCompileChecker, SaveSolution };
