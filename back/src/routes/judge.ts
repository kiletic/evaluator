import express from 'express';
import langs from '../config/lang';
import { promises as fs } from 'fs';
import path from 'path';
import { Compile, Run } from '../controllers/judge';

var router = express.Router();

router.post('/api/judge/compile', async (req, res) => {
	// TODO: For now this is only for checker written in c++ that came from add-task, in the future rewrite this to be more general.	
	
	try {
		await fs.writeFile(path.join(__dirname, '../../local/test/compile/solution.cpp'), req.body.code);	
	} catch(error) {	
		res.json({ verdict: "Error", stderr: "Failed to create checker file." });
		console.log(error.sterr);

		return;
	} 

	try {
		await Compile('solution', 'c_cpp', './local/test/compile');
	} catch(error) {
		res.json({ verdict: "Compile error", stderr: error.stderr })

		return;
	}

	res.json({ verdict: 'Compiled successfully', stderr: "" });
});

router.post('/api/judge/run', async (req, res) => {
	// TODO: For now this is only for code that came from add-task, in the future rewrite this to be more general.
	
	const INPUT_PATH: string = path.join(__dirname, '../../local/test/run/input.in');

	try {
		await fs.writeFile(INPUT_PATH, req.body.input);
	} catch(error) {
		res.json({ verdict: "Error", stderr: "Failed to create input file." });
		
		return;
	}

	const SOL_DIR: string = path.join(__dirname, '../../local/test/run/');

	try {
		await fs.writeFile(path.join(SOL_DIR, 'solution' + langs[req.body.solution.language].ext), req.body.solution.code);
	} catch (error) {
		res.json({ verdict: "Error", stderr: "Failed to create solution file." });
		
		return;
	}

	try {
		await Compile('solution', req.body.solution.language, './local/test/run/'); 
	} catch(error) {
		res.json({ verdict: "Compile error", stderr: error.stderr })

		return;
	}

	try {
		const { stdout } = await Run(SOL_DIR, parseInt(req.body.timelimit) / 1000, parseInt(req.body.memorylimit) * 1024 * 1024, INPUT_PATH, langs[req.body.solution.language].run('solution'), './src/lib/run/');

		if (stdout.verdict === 'okay') {
			res.json({ verdict: "okay", stderr: stdout.output });
		} else {
			let verdict: string;
			if (stdout.verdict === 'tle') {
				verdict = 'Time Limit Exceeded';
			} else if (stdout.verdict === 'rte') {
				verdict = 'Runtime Error';
			} else if (stdout.verdict === 'mle') {
				verdict = 'Memory Limit Exceeded';
			} else {
				verdict = 'Unknown';
			}
			res.json({ verdict: "Error", stderr: verdict });
		}
	} catch(error) {
		res.json({ verdict: "Error", stderr: "Unexpected error with python testcase checker." })

		return;
	}
});

export default router;
