import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../scss/Problemset.scss'
import TaskRow from './TaskRow' 

import { BsCheck, BsX } from 'react-icons/bs';

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
					<Link to = {`/problemset/tasks/${task.taskId}`} key = {task.taskId}>
						<div className = "row">
							<div className = "task-name">
								<TaskRow content = {task.name} />
							</div>
							{task.solved === false &&
								<BsX color = "red" fontSize = {"30px"} strokeWidth = {1.3} />
							}
							{task.solved === true &&
								<BsCheck color = "green" fontSize = {"30px"} strokeWidth = {1.7} />
							}
						</div>
					</Link>
				))}
			</div>
		</div>
	) : null;
}

export default Problemset;
