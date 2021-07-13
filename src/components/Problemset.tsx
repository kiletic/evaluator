import { useState } from 'react'
import '../scss/Problemset.scss'
import TaskRow from './TaskRow' 

const Problemset = () => {
	const [tasks, addTask]: any = useState([]);

	const fetchTasks = async () => {
		await fetch('http://localhost:5000/tasks')
		.then(res => res.json())
		.then(taskList => {
			let tasksToAdd = [];
			for (var task of taskList) {
				const newTask = (
					<div className = "row" key = {tasks.length + tasksToAdd.length}>
						<div className = "task-name">
							<TaskRow key = {tasks.length + tasksToAdd.length} content = {task.name} />
						</div>
						<div className = "task-solved-icon">
							<img src = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-256.png"></img>
						</div>
					</div>
				)
				tasksToAdd.push(newTask);
			}
			addTask(tasks.concat(tasksToAdd));	
		});
	}

	return (
		<div className = "Problemset">
			<div className = "container">
				<button onClick = {fetchTasks}> Generate </button>
				{tasks}
			</div>
		</div>
	)
}

export default Problemset;
