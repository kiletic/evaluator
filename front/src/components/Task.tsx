import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import Parser from 'html-react-parser';

import '../scss/Task.scss'

const Task = () => {
	const { id } = useParams() as any;
	const [task, setTask]: any = useState({});

	const taskPath = "/problemset/tasks/" + id;
	const submitPath = "/problemset/submit/" + id;
	const statsPath = "/problemset/stats/" + id;

	useEffect(() => {
		fetch(`http://localhost:4000/api/tasks/${id}`)
			.then(res => res.json())
			.then(data => {
				if (data.testcases) {
					for (var i = 0; i < data.testcases.length; i++) {
						data.testcases[i].preInput = data.testcases[i].input.replace(/\n/g, "<br/>");	
						data.testcases[i].preOutput = data.testcases[i].output.replace(/\n/g, "<br/>");	
					}
				}
				setTask(data);
			});
	}, [id]);

	useEffect(() => {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}, [task]);

	const copyToClipboard = (text: string) => {
		const dummy = document.createElement('textarea');
		dummy.textContent = text;
		document.body.append(dummy);
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	}
	
	return Object.keys(task).length !== 0 ? (
		<div className = "Task">
			<div className = "container">
				<div className = "content">
					<div className = "bar">
						<ol>
							<NavLink activeClassName = "active" exact to = {taskPath}><li>Task</li></NavLink>
							<NavLink activeClassName = "active" exact to = {submitPath}><li>Submit</li></NavLink>
							<NavLink activeClassName = "active" exact to = {statsPath}><li>Stats</li></NavLink>
						</ol>
					</div>
						<h1> {task.name} </h1>
						{Parser(task.text)}
						<div className = "Input">
							<h3> Input </h3>
							{Parser(task.inputText)}
						</div>
						<div className = "Output">
							<h3> Output </h3>
							{Parser(task.outputText)}
						</div>
						<div className = "Samples">
							<h3> Sample tests </h3>
							{task.testcases.map((testcase: any, index: number)  => (
								<div className = "testcase" key = {index}>
									<div className = "in">
										<div className = "tc-header">
											<h4> {"Input #" + (index + 1)} </h4> 
											<button className = "cp-btn" onClick = {() => copyToClipboard(testcase.input)} data-clipboard-text = "1"> Copy </button>
										</div>
										<pre>{Parser(testcase.preInput)}</pre> 
									</div>
									<div className = "out">
										<div className = "tc-header">
											<h4> {"Output #" + (index + 1)} </h4>
											<button className = "cp-btn" onClick = {() => copyToClipboard(testcase.output)}> Copy </button>
										</div>
										<pre>{Parser(testcase.preOutput)}</pre>
									</div>
									{testcase.note && 
									<div className = "note">
										<h4> {"Note #" + (index + 1)} </h4>
										{Parser(testcase.note)}
									</div>}
								</div>
							))}
						</div>
				</div>
				<div className = "history">
					<h3> My submissions </h3>	
				</div>
			</div>
		</div>
	) : null;
}

export default Task;
