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

// timeLimit in seconds 
// memoryLimit in bytes
const Run = async (solutionDirectory: string, timeLimit: number, memoryLimit: number, inputPath: string, solutionRunCmd: string, cwd: string) => {
	try {
		const ret = await exec(`python3 run_tc.py ${solutionDirectory} ${timeLimit} ${memoryLimit} ${inputPath} ${solutionRunCmd}`, { cwd: cwd });

		return {...ret, stdout: JSON.parse(ret.stdout)};
	} catch (error) {
		throw error;
	}
};

export { Compile, Run };
