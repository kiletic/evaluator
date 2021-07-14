import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../scss/Problemset.scss'
import TaskRow from './TaskRow' 

const Problemset = () => {
	const [tasks, setTasks] = useState(null);

	useEffect(() => {
		fetch('http://localhost:5000/tasks')
			.then(res => res.json())
			.then(taskList => {
				setTasks(taskList);
			});
	}, []);

	return (
		<div className = "Problemset">
			<div className = "container">
				{tasks && tasks.map(task => (
					<Link to = {`/problemset/tasks/${task.id}`} >
						<div className = "row" key = {task.id}>
							<div className = "task-name">
								<TaskRow content = {task.name} />
							</div>
							<div className = "task-solved-icon">
								<img src = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-256.png" alt = "solved"></img>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default Problemset;
