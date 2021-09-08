import express from 'express';
import { exec } from 'child_process';
import langs from '../config/lang';
import fs from 'fs';
import path from 'path';

var router = express.Router();

router.post('/api/judge/compile', async (req, res) => {
	// TODO: For now this is only for c++ code that came from add-task, in the future rewrite this to be more general.	
	// TODO: Use promises with await instead of callbacks.
	
	fs.writeFile(path.join(__dirname, '../../local/test/compile/solution.cpp'), req.body.code, (err) => {
		if (err) {
			res.json({ verdict: "Compile error", stderr: "Failed to create checker file." });
			console.log(err);
			return;
		}

		exec(langs['c_cpp'].compile('solution') + ' -I ../../../src/lib/checkers/', { cwd: './local/test/compile' }, (error, stdout, stderr) => {
			if (error) {
				res.json({ verdict: "Compile error", stderr: stderr })
				return;
			}	

			res.json({ verdict: 'Compiled successfully', stderr: "" });
		});					
	})
});

router.post('/api/judge/run', async (req, res) => {
	// TODO: For now this is only for code that came from add-task, in the future rewrite this to be more general.
	// TODO: Use promises with await instead of callbacks.
	
	const INPUT_PATH: string = path.join(__dirname, '../../local/test/run/input.in');

	fs.writeFile(INPUT_PATH, req.body.input, (err) => {
		if (err) {
			res.json({ verdict: "Error", stderr: "Failed to create input file." });
			return;
		}

		const SOL_DIR: string = path.join(__dirname, '../../local/test/run/');
		fs.writeFile(path.join(SOL_DIR, 'solution' + langs[req.body.solution.language].ext), req.body.solution.code, (err) => {
			if (err) {
				res.json({ verdict: "Error", stderr: "Failed to create solution file." });
				return;
			}

			exec(langs[req.body.solution.language].compile('solution'), { cwd: './local/test/run/' }, (error, stdout, stderr) => {
				if (error) {
					res.json({ verdict: "Compile error", stderr: stderr })
					return;
				}	

				exec(`python3 run_tc.py ${SOL_DIR} ${parseInt(req.body.timelimit) / 1000} ${parseInt(req.body.memorylimit) * 1024 * 1024} ${INPUT_PATH} ${langs[req.body.solution.language].run('solution')}`, { cwd: './src/lib/run/' }, (error, stdout, stderr) => {
					if (error) {
						res.json({ verdict: "Error", stderr: "Unexpected error with python testcase checker." })
						return;
					}

					const message: any = JSON.parse(stdout);
					if (message.verdict == 'okay') {
						res.json({ verdict: "okay", stderr: message.output });
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
						res.json({ verdict: "Error", stderr: verdict });
					}
				});
			});					
		})
	})	
});

export default router;
