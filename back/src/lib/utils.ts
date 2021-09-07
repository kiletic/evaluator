import fs from 'fs';
import path from 'path';

const submissionPath: string = path.join(__dirname, '..', '..', 'local', 'submissions');
const tasksPath: string = path.join(__dirname, '..', '..', 'local', 'tasks') 

const GetSubmissionCode = async (submissionId: number) => {
	return fs.readFileSync(path.join(submissionPath, `${submissionId}`, 'solution.cpp'));
};

const GetTestcaseResults = async (submissionId: number, testcases: any, taskId: number) => {
	const ret: Array<any> = [];
	for (var i = 0; i < testcases.length; i++) {
		var inp: string = fs.readFileSync(path.join(tasksPath, '1', 'input', `${i + 1}.in`), { encoding: 'utf-8' });
		var out: string = fs.readFileSync(path.join(submissionPath, `${submissionId}`, `${testcases[i].output}`), { encoding: 'utf-8' });

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

export { GetSubmissionCode, GetTestcaseResults };
