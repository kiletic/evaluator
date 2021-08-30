import { execSync, exec } from 'child_process';

const Submit = async () => {
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

export { Submit }; 
