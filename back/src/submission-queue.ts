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
		this.taskInfo.timelimit = submissionInfo.timelimit;
		this.taskInfo.memorylimit = submissionInfo.memorylimit;
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
			this.submission.result = 'Accepted';
			this.finish_work();

			return;
		} 

		this.submission.result = `Running on testcase ${tcNum + 1}`;
		console.log(`Running on testcase ${tcNum + 1}...`);

		const INPUT_PATH: string = path.join(this.taskInfo.path, 'input', this.taskInfo.inputs[tcNum]);

		try {
			const { stdout } = await Run(this.submissionPath, 
																	 this.taskInfo.timelimit / 1000, 
																	 this.taskInfo.memorylimit * 1024 * 1024,
																	 INPUT_PATH,
																	 this.runCmd);

			// update only if less than timelimit (because of re-runs)
			if (stdout.time * 1000 < this.taskInfo.timelimit)
				this.time = Math.max(this.time, Math.floor(stdout.time * 1000));
			this.memory = Math.max(this.memory, Math.floor(stdout.memory));

			// add testcase if its not re-run
			if (this.submission.testcaseResults.length <= tcNum) {
				this.submission.testcaseResults.push({ 
					result: 'Pending', 
					timeTaken: Math.floor(stdout.time * 1000),
					memoryTaken: Math.floor(stdout.memory)
				});
			}

			// save output
			await fs.writeFile(path.join(this.submissionPath, `${tcNum + 1}.out`), stdout.output);

			if (stdout.result === 'okay') {
				// SEND TO CHECKER
				this.check_output(tcNum);	
			} else {
				let result: string;
				 if (stdout.result === 'tle close' && iteration < 2) {
					this.run_testcase(tcNum, iteration + 1);
					return;
				} else if (stdout.result === 'rte') {
					result = 'Runtime Error';
				} else if (stdout.result === 'mle') {
					result = 'Memory Limit Exceeded';
				} else if (stdout.result === 'tle' || stdout.result === 'tle close') {
					result = 'Time Limit Exceeded';
				} else {
					result = 'Unknown';
				}

				this.submission.result = `${result} on testcase ${tcNum + 1}`;
				this.submission.testcaseResults[tcNum].result = result;

				if (result === 'Memory Limit Exceeded') {
					this.submission.memoryTaken = -1;
					this.submission.testcaseResults[tcNum].memoryTaken = -1;
				} else {
					this.submission.memoryTaken = this.memory;
				}

				if (result === 'Time Limit Exceeded') {
					this.submission.timeTaken = -1;
					this.submission.testcaseResults[tcNum].timeTaken = -1;
				} else {
					this.submission.timeTaken = this.time;
				}

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

		exec(cmd, { cwd: this.checkerPath }, (error, stdout, stderr) => {
			if (error) {
				console.log("Unexpected error when calling checker.");
				console.log(stderr);

				return;
			}	

			console.log(stdout);

			this.submission.memoryTaken = this.memory;
			this.submission.timeTaken = this.time; 

			if (stdout === 'Wrong Answer') {
				this.submission.result = `Wrong Answer on testcase ${tcNum + 1}`;
				this.submission.testcaseResults[tcNum].result = 'Wrong Answer';
	
				this.finish_work();
			} else {
				this.submission.testcaseResults[tcNum].result = 'Accepted';
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
