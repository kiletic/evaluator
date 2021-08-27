import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'

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
				setTask(data[0]);
			});
	}, [id]);

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
					{task.text}
					<div className = "Input">
						<h3> Input </h3>
						This is where input goes.
						<h3> Output </h3>
						This is where output goes.
						<h3> Sample tests </h3>
						This is where sample tests go.
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
