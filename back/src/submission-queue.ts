import queue from 'queue-fifo';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { Run } from './controllers/judge';

class Worker {
	submission: any;
	submissionPath: string;
	taskInfo: any;
	time: number;
	memory: number;
	runCmd: string;
	checkerPath: string;

	constructor() {
		this.submission = null;
		this.submissionPath = '';
		this.taskInfo = {};
		this.time = 0;
		this.memory = 0;
		this.runCmd = "";
		this.checkerPath = "";
	}

	jobless() {
		return this.submission ? false : true;
	}
	
	async assign(submissionInfo: any) {
		this.submission = submissionInfo.submission;
		this.submissionPath = path.join(__dirname, `../local/submissions/${this.submission.submissionId}`);
		this.taskInfo.timeLimit = submissionInfo.timeLimit;
		this.taskInfo.memoryLimit = submissionInfo.memoryLimit;
		this.taskInfo.path = path.join(__dirname, '..', 'local', 'tasks', `${submissionInfo.taskId}`);
		this.taskInfo.inputs = await fs.readdir(path.join(this.taskInfo.path, 'input'));
		this.runCmd = submissionInfo.run;
		this.checkerPath = submissionInfo.checkerPath; 

		console.log("Starting to evaluate new submission!");
		this.run_testcase(0);
	} 

	finish_work() {
		this.submission.save();

		this.submission = null;
		this.time = 0;
		this.memory = 0;
	}

	async run_testcase(tcNum: number, iteration: number = 0) {
		if (tcNum === this.taskInfo.inputs.length) {
			// THE END -> ACCEPTED!
			this.submission.result = 'Accepted';
			this.finish_work();

			return;
		} 

		this.submission.result = `Running on testcase ${tcNum + 1}`;
		console.log(`Running on testcase ${tcNum + 1}...`);

		const INPUT_PATH: string = path.join(this.taskInfo.path, 'input', this.taskInfo.inputs[tcNum]);

		try {
			const { stdout } = await Run(this.submissionPath, 
																	 this.taskInfo.timeLimit / 1000, 
																	 this.taskInfo.memoryLimit * 1024 * 1024,
																	 INPUT_PATH,
																	 this.runCmd,
																	 './src/lib/run');


			// update only if less than timelimit (because of re-runs)
			if (stdout.time * 1000 < this.taskInfo.timeLimit)
				this.time = Math.max(this.time, Math.floor(stdout.time * 1000));
			this.memory = Math.max(this.memory, Math.floor(stdout.memory));
			
			// save output
			await fs.writeFile(path.join(this.submissionPath, `${tcNum + 1}.out`), stdout.output);

			if (stdout.verdict === 'okay') {
				// SEND TO CHECKER
				this.check_output(tcNum);	
			} else {
				let verdict: string;
				 if (stdout.verdict === 'tle close' && iteration < 2) {
					this.run_testcase(tcNum, iteration + 1);

					return;
				} else if (stdout.verdict === 'rte') {
					verdict = 'Runtime Error';
				} else if (stdout.verdict === 'mle') {
					verdict = 'Memory Limit Exceeded';
				} else if (stdout.verdict === 'tle' || stdout.verdict === 'tle close') {
					verdict = 'Time Limit Exceeded';
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
		} catch (error) {
			console.log("Unexpected error when calling python testcase checker.");
			
			console.log(error);
			return;
		}
	}

	async check_output(tcNum: number) {
		const inputFilePath = path.join(this.taskInfo.path, 'input') + `/${tcNum + 1}.in`;
		const userOutputFilePath = path.join(this.submissionPath, `${tcNum + 1}.out`);
		const correctOutputFilePath = path.join(this.taskInfo.path, 'output') + `/${tcNum + 1}.out`;

		const cmd = './checker' + ' ' + inputFilePath + ' ' + userOutputFilePath + ' ' + correctOutputFilePath; 

		exec(cmd, { cwd: './src/lib/checkers' }, (error, stdout, stderr) => {
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
				this.submission.result = `Accepted`;
				this.submission.testcaseResults.push({
					verdict: 'Accepted',
					output: `${tcNum + 1}.out`
				});
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

	async assign_submission() {
		if (this.submissions.isEmpty()) {
			return;
		}

		for (var i = 0; i < this.numWorkers; i++) {
			if (this.workers[i].jobless()) {
				const submission = this.submissions.dequeue();
				this.workers[i].assign(submission);
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
