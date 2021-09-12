import { useState } from 'react';
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-haskell"
import "ace-builds/src-noconflict/theme-cobalt"

import '../scss/AddTask.scss';

const AddTask = () => {
	const [task, setTask] = useState({
		name: "",
		statement: "",
		input: "",
		output: "",
		timelimit: "2000",
		memorylimit: "512",
		checker: {
			code: "",
			isCompiled: false,
			compilationMessage: ""
		},
		solution: {
			language: "c_cpp",
			code: ""
		},
		testcases: [] as Array<any> 
	});

	const [custom, setCustom] = useState(false);

	const emptyTestcase = {
		input: "",
		output: "",
		note: "",
		sample: false,
		hidden: false
	};

	const changeTestcase = (fieldToChange: string, value: any, tcNum: number) => {
		setTask({...task, testcases: task.testcases.map((testcase: any, i: number) => 
			i === tcNum 
			? {...testcase, [fieldToChange]: value}
			: testcase
		)});
	};

	const requestCompilation = async () => {
		fetch('http://localhost:4000/api/judge/compile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: task.checker.code })
		}).then(res => res.json())
			.then(data => {
				console.log(data);	
				if (data.result !== 'Compiled successfully') {
					setTask({...task, checker: {...task.checker, compilationMessage: 'Compile Error!\n' + data.stderr}});	
				} else {
					setTask({...task, checker: {...task.checker, isCompiled: true, compilationMessage: data.result}});	
				}
			});
	};

	const generateOutput = async (tcNum: number) => {
		fetch('http://localhost:4000/api/judge/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ solution: task.solution, input: task.testcases[tcNum].input, timelimit: task.timelimit, memorylimit: task.memorylimit })
		}).then(res => res.json())
			.then(data => {
				if (data.result === 'okay') {
					changeTestcase('output', data.stderr, tcNum);
				} else {
					changeTestcase('output', data.result + '\n' + data.stderr, tcNum);
				}
			});
	};

	const saveTask = async () => {
		if (custom && !task.checker.isCompiled) {
			console.log("Compile the checker before saving task.");
			return;
		}

		fetch('http://localhost:4000/api/tasks/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(custom ? task : {...task, checker: null})
		})	
	};

	return (
		<div className = "AddTask">
			<div>
				Task name
				<input type = "text" onChange = {e => { setTask({...task, name: e.target.value}); }} value = {task.name} />
			</div>
			
			<div>
				Time limit (in ms)
				<input type = "text" onChange = {e => { setTask({...task, timelimit: e.target.value}); }} value = {task.timelimit} />
			</div>

			<div>
				Memory limit (in MB)
				<input type = "text" onChange = {e => { setTask({...task, memorylimit: e.target.value}); }} value = {task.memorylimit} />
			</div>

			<div>
				Statement
				<textarea onChange = {e => { setTask({...task, statement: e.target.value}); }} />
			</div>

			<div>
				Input	
				<textarea onChange = {e => { setTask({...task, input: e.target.value}); }} />
			</div>

			<div>
				Output	
				<textarea onChange = {e => { setTask({...task, output: e.target.value}); }} />
			</div>

		<div>
			Checker	
			<select onChange = {e => { setCustom(e.target.value === 'custom') }}>
				<option value = "default"> default (line by line, ignore whitespaces) </option>
				<option value = "custom"> custom </option>
			</select>

				{custom &&  
				<>
					<AceEditor mode = "c_cpp" theme = "cobalt" width = "600px" onChange = {newCode => setTask({...task, checker: {code: newCode, isCompiled: false, compilationMessage: ""}}) } value = {task.checker.code} />
					<button onClick = {() => requestCompilation()}> Compile </button>
					<textarea readOnly={true} value={task.checker.compilationMessage}/> 
				</>
				}	
			</div>
			<div>
				<div>Correct solution</div>	
				Select language: 
				<select onChange = {e => { setTask({...task, solution: {...task.solution, language: e.target.value}}) }}>
					<option value = "c_cpp"> C++ </option>
					<option value = "haskell"> Haskell </option>
					<option value = "python"> Python </option>
				</select>
				<AceEditor mode = {task.solution.language} theme = "cobalt" width = "600px" onChange = {newCode => setTask({...task, solution: {...task.solution, code: newCode}}) } value = {task.solution.code} />
			</div>
			<div>
				<div>Testcases</div>
				{task.testcases.map((testcase: any, index: number) => (
					<div key = {index}> 
						{`Testcase #${index + 1}`}
						<button onClick = {() => changeTestcase('hidden', !testcase.hidden, index)}> {testcase.hidden ? 'Show' : 'Hide'} </button>
						{!testcase.hidden &&
						<>
							<div>
								Input
								<textarea onChange = {e => changeTestcase('input', e.target.value, index)} value = {testcase.input}/>
							</div>

							<div>
								Output	
								<textarea onChange = {e => changeTestcase('output', e.target.value, index)} value = {testcase.output}/>
								<button onClick = {() => generateOutput(index)}> Generate output </button>
							</div>
							
							{testcase.sample && 
							<div>
								Note	
								<textarea onChange = {e => changeTestcase('note', e.target.value, index)} value = {testcase.note}/>
							</div>}

							<div>
								Sample	
								<input type = "checkbox" onChange = {() => changeTestcase('sample', !testcase.sample, index)} checked = {testcase.sample} />
							</div>
						</>
						}
					</div>
				))}
				<button onClick = {() => setTask({...task, testcases: [...task.testcases, emptyTestcase]})}> Add testcase </button>
			</div>
			<button onClick = {() => saveTask()}> Save task </button>	
		</div>
	);	
};

export default AddTask;
