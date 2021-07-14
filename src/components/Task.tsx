import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../scss/Task.scss'

const Task = () => {
	const { id } = useParams() as any;
	const [task, setTask] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:5000/tasks/${id}`)
			.then(res => res.json())
			.then(data => {
				setTask(data);
			});
	}, [id]);

	return (
		<div className = "Task">
			<div className = "container">
				<div className = "content">
					<div className = "bar">
						<ol>
							<li>Submit</li>
							<li>Placeholder</li>
							<li>Placeholder</li>
						</ol>
					</div>
					<h1> {task && task.name} </h1>
					{task && task.content}
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
	);
}

export default Task;
