import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-haskell"

import "ace-builds/src-noconflict/theme-cobalt"

import '../scss/Submit.scss'

const Submit = () => {
	const { id } = useParams() as any;

	const [mode, setMode] = useState("c_cpp");

	const taskPath = "/problemset/tasks/" + id;
	const submitPath = "/problemset/submit/" + id;
	const statsPath = "/problemset/stats/" + id;

	const submitCode = () => {
		fetch('http://localhost:4000/api/submit', { method: "POST" })
			.then(res => res.json())
			.then(data => data);
	};
	
	return (
		<div className = "Submit">
			<div className = "container">
				<div className = "bar">
					<ol>
						<NavLink activeClassName = "active" exact to = {taskPath}><li>Task</li></NavLink>
						<NavLink activeClassName = "active" exact to = {submitPath}><li>Submit</li></NavLink>
						<NavLink activeClassName = "active" exact to = {statsPath}><li>Stats</li></NavLink>
					</ol>
				</div>
				<h1> Submit </h1>
				Select your language: 
				<select className = "lang-picker" onChange = {(e) => setMode(e.target.value)} id = "lang-picker">
					<option value = "c_cpp"> C/C++ </option>
					<option value = "haskell"> Haskell </option>
					<option value = "python"> Python </option>
				</select>
				<div className = "editors">
					<AceEditor mode = {mode} theme = "cobalt" width = "600px"/>
					<div className = "inout-box">
						<p> Input: </p>
						<textarea rows = {8} cols = {25}>
						</textarea>
						<p> <button> Run code </button> </p>
						<p> Output: </p>
						<textarea readOnly rows = {8} cols = {25}>
						</textarea>
					</div>
				</div>
			  <button className = "submit-btn" onClick = {() => submitCode()}> Submit code </button>
			</div>
		</div>
	)
}

export default Submit;
