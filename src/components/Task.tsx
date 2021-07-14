import { useParams } from 'react-router-dom'

const Task = () => {
	const { id } = useParams();

	return (
		<div className = "Task">
			<div className = "container">
				<div className = "content">
					<h1> Task - { id } </h1>
				</div>
				<div className = "history">
				</div>
			</div>
		</div>
	);
}

export default Task;
