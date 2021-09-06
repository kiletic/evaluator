import queue from 'queue-fifo';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

class Worker {
	submission: any;
	submissionPath: string;
	taskInfo: any;
	time: number;
	memory: number;
	runCmd: string;

	constructor() {
		this.submission = null;
		this.submissionPath = '';
		this.taskInfo = {};
		this.time = 0;
		this.memory = 0;
		this.runCmd = "";
	}

	jobless() {
		return this.submission ? false : true;
	}
	
	async assign(task: any) {
		this.submission = task.submission;
		this.submissionPath = path.join(__dirname, `../../local/submissions/${this.submission.submissionId}`);
		this.taskInfo.timeLimit = task.timeLimit;
		this.taskInfo.memoryLimit = task.memoryLimit;
		// dont forget to change '1' to task ID!!!
		this.taskInfo.path = path.join(__dirname, '..', '..', 'local', 'tasks', '1');
		this.taskInfo.inputs = fs.readdirSync(path.join(this.taskInfo.path, 'input'));
		this.runCmd = task.run;

		this.run_testcase(0);
	} 

	async finish_work() {
		this.submission.save();

		this.submission = null;
		this.time = 0;
		this.memory = 0;
	}

	async run_testcase(tcNum: number) {
		if (tcNum === this.taskInfo.inputs.length) {
			// THE END -> ACCEPTED!
			this.submission.result = 'Accepted';
			this.finish_work();

			return;
		} 

		this.submission.result = `Running on testcase ${tcNum + 1}`;
		console.log(`Running on testcase ${tcNum + 1}...`);

		const INPUT_PATH: string = path.join(this.taskInfo.path, 'input', this.taskInfo.inputs[tcNum]);
		const cwd: string = this.submissionPath;

//		console.log(`python3 run_tc.py ${cwd} ${this.taskInfo.timeLimit / 1000} ${this.taskInfo.memoryLimit * 1024 * 1024} ${INPUT_PATH} ${this.runCmd}`);

		const child = exec(`python3 run_tc.py ${cwd} ${this.taskInfo.timeLimit / 1000} ${this.taskInfo.memoryLimit * 1024 * 1024} ${INPUT_PATH} ${this.runCmd}`,			{ cwd: './src/controllers/' },
		(error, stdout, stderr) => {
			if (error) {
				console.log("Unexpected error when calling python testcase checker.");
				return;
			}
			const message: any = JSON.parse(stdout);

			this.time = Math.max(this.time, Math.floor(message.time * 1000));
			this.memory = Math.max(this.memory, Math.floor(message.memory));
			
			// save output
			fs.appendFileSync(path.join(this.submissionPath, `${tcNum + 1}.out`), message.output);

			if (message.verdict === 'okay') {
				// SEND TO CHECKER
				this.check_output(tcNum);	
			} else {
				let verdict: string;
				if (message.verdict === 'tle') {
					verdict = 'Time Limit Exceeded';
				} else if (message.verdict === 'rte') {
					verdict = 'Runtime Error';
				} else if (message.verdict === 'mle') {
					verdict = 'Memory Limit Exceeded';
				} else {
					verdict = 'Unknown';
				}

				this.submission.result = `${verdict} on testcase ${tcNum + 1}`;
				this.submission.memoryTaken = (verdict === 'Memory Limit Exceeded' ? -1 : this.memory);
				this.submission.timeTaken = (verdict === 'Time Limit Exceeded' ? -1 : this.time);
				this.submission.testcaseResults.push({
					verdict: verdict,
					output: `${tcNum + 1}.out` 
				});

				this.finish_work();
			}
		});	
	}

	async check_output(tcNum: number) {
		const inputFilePath = path.join(this.taskInfo.path, 'input') + `/${tcNum + 1}.in`;
		const userOutputFilePath = path.join(this.submissionPath, `${tcNum + 1}.out`);
		const correctOutputFilePath = path.join(this.taskInfo.path, 'output') + `/${tcNum + 1}.out`;

		const cmd = './checker' + ' ' + inputFilePath + ' ' + userOutputFilePath + ' ' + correctOutputFilePath; 

		const child = exec(cmd, { cwd: './src/lib/' }, (error, stdout, stderr) => {
			if (error) {
				console.log("Unexpected error when calling checker.");
				console.log(stderr);

				return;
			}	

			this.submission.memoryTaken = this.memory;
			this.submission.timeTaken = this.time; 

			if (stdout === 'Wrong answer') {
				this.submission.result = `Wrong Answer on testcase ${tcNum + 1}`;
				this.submission.testcaseResults.push({
					verdict: 'Wrong Answer',
					output: `${tcNum + 1}.out`
				});
	
				this.finish_work();
			} else {
				// Go to next testcase
				this.run_testcase(tcNum + 1);
			}
		})
	}
}

class SubmissionQueue {
	numWorkers: number;
	workers: Array<Worker>;
	submissions: queue<any>;
	interval: any;

	constructor(numWorkers: number) {
		this.numWorkers = numWorkers;
		this.workers = [];
		this.submissions = new queue();

		for (var i = 0; i < this.numWorkers; i++) {
			this.workers.push(new Worker());
		}
	}

	assign_submission() {
		if (this.submissions.isEmpty()) {
			return;
		}

		const task = this.submissions.dequeue();
		for (var i = 0; i < this.numWorkers; i++) {
			if (this.workers[i].jobless()) {
				this.workers[i].assign(task);
				break;
			}
		}
		
		if (this.submissions.isEmpty()) {
			clearInterval(this.interval);	
		}
	}

	push(task: any) {
		this.submissions.enqueue(task);

		if (this.submissions.size() === 1) {
			this.interval = setInterval(() => this.assign_submission(), 100);
		}
	}
}

export default SubmissionQueue;
