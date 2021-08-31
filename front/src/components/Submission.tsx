import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'

const Submission = () => {
	const { id } = useParams() as any;

	const [submission, setSubmission]: any = useState({});

	useEffect(() => {
		let mounted = true;

		const GetSubmission = async () => {
			if (!mounted) return;

			fetch(`http://localhost:4000/api/submission/${id}`)
				.then(res => res.json())
				.then(data => {
					if (data.message) {
						console.log(data.message);	
					} else {
						if (data.result === 'Pending') {
							setSubmission({ ...data, result: data.result });
							setTimeout(GetSubmission, 2000);
						} else {
							setSubmission({ ...data, result: data.result, testcaseResults: data.testcaseResults });
						}
					}
				});
		};

		GetSubmission();

		return () => { mounted = false };
	}, []);

	return (
		<div className = "Submission">
		{submission.result}
		</div>
	)
};

export default Submission;
