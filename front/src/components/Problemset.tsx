import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../scss/Problemset.scss'
import TaskRow from './TaskRow' 

const Problemset = () => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		fetch('http://localhost:4000/api/tasks')
			.then(res => res.json())
			.then(taskList => {
				setTasks(taskList);
			});
	}, []);

	return tasks !== [] ? (
		<div className = "Problemset">
			<div className = "container">
				{tasks.map((task: any) => (
					<Link to = {`/problemset/tasks/${task._id}`} key = {task._id}>
						<div className = "row">
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
	) : null;
}

export default Problemset;
