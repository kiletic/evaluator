import langs from '../config/lang';
import util from 'util';
const exec = util.promisify(require('child_process').exec);

const Compile = async (name: string, language: string, cwd: string, isChecker: boolean = false) => {
	try {
		await exec(langs[language].compile(name) + (isChecker ? ' -I ../../../src/lib/checkers/' : ''), { cwd: cwd });
	} catch (error) {
		throw error;
	}
};

// timelimit in seconds 
// memorylimit in bytes
const Run = async (solutionDirectory: string, timelimit: number, memorylimit: number, inputPath: string, solutionRunCmd: string) => {
	try {
		const ret = await exec(`python3 run_tc.py ${solutionDirectory} ${timelimit} ${memorylimit} ${inputPath} ${solutionRunCmd}`, { cwd: './src/lib/run/' });

		return {...ret, stdout: JSON.parse(ret.stdout)};
	} catch (error) {
		throw error;
	}
};

export { Compile, Run };
