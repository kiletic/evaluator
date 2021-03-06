import { useState } from 'react'
import { useParams, NavLink, useHistory } from 'react-router-dom'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-haskell"

import "ace-builds/src-noconflict/theme-cobalt"

import '../scss/Submit.scss'

const Submit = () => {
	const { id } = useParams() as any;
	const history = useHistory();

	const [language, setLanguage] = useState("c_cpp");
	const [code, setCode] = useState("");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	const taskPath = "/problemset/tasks/" + id;
	const submitPath = "/problemset/submit/" + id;

	const submitCode = async () => {
		fetch(`http://localhost:4000/api/submit/${id}`, { 
			method: "POST",
			headers: {
				'Content-type': 'application/json'	
			},	
			body: JSON.stringify({ 'code' : code, 'language' : language })		
		}).then(res => res.json())
			.then(data => {
				console.log(data);
				history.push(`/submission/${data.submissionId}`);
			});
	};

	const runCode = async () => {
		const data = await fetch(`http://localhost:4000/api/tasks/${id}`, { method: "GET" });	
		const task = await data.json();

		fetch('http://localhost:4000/api/judge/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ solution: { code: code, language: language }, input: input, timelimit: task.timelimit, memorylimit: task.memorylimit })
		}).then(res => res.json())
			.then(data => {
				if (data.result === 'okay') {
					setOutput(data.stderr);
				} else {
					setOutput(data.result + '\n' + data.stderr);
				}
			});
	};
	
	return (
		<div className = "Submit">
			<div className = "container">
				<div className = "bar">
					<ol>
						<NavLink activeClassName = "active" exact to = {taskPath}><li>Task</li></NavLink>
						<NavLink activeClassName = "active" exact to = {submitPath}><li>Submit</li></NavLink>
					</ol>
				</div>
				<h1> Submit </h1>
				Select your language: 
				<select className = "lang-picker" onChange = {(e) => setLanguage(e.target.value)} id = "lang-picker">
					<option value = "c_cpp"> C/C++ </option>
					<option value = "haskell"> Haskell </option>
					<option value = "python"> Python </option>
				</select>
				<div className = "editors">
					<AceEditor mode = {language} theme = "cobalt" width = "600px" onChange = {(newCode) => setCode(newCode)}/>
					<div className = "inout-box">
						<p> Input: </p>
						<textarea rows = {8} cols = {25} onChange = {(e) => setInput(e.target.value)}>
						</textarea>
						<p> <button onClick = {() => runCode()}> Run code </button> </p>
						<p> Output: </p>
						<textarea readOnly rows = {8} cols = {25} value = {output}>
						</textarea>
					</div>
				</div>
			  <button className = "submit-btn" onClick = {() => submitCode()}> Submit code </button>
			</div>
		</div>
	)
}

export default Submit;
