import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import AceEditor from 'react-ace'
import { copyToClipboard } from '../utils';

import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-haskell"

import "ace-builds/src-noconflict/theme-cobalt"

import '../scss/Submission.scss';

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

	return Object.keys(submission).length !== 0 ? (
		<div className = "Submission">
			<div className = "header">
				<div className = "row">
				 <div className = "cell"> <h3> User </h3> </div>
				 <div className = "cell"> <h3> Task </h3> </div>
				 <div className = "cell"> <h3> Result </h3> </div>
				 <div className = "cell"> <h3> Time </h3> </div>
				 <div className = "cell"> <h3> Memory </h3> </div>
				 <div className = "cell"> <h3> Date </h3> </div>
				 <div className = "cell"> <h3> Language </h3> </div>
				</div>
				<div className = "row">
				 <div className = "lower cell"> {submission.userName} </div>
				 <div className = "lower cell"> <NavLink to = {`/problemset/tasks/${submission.task.id}`}> {submission.task.name} </NavLink> </div>
				 <div className = {submission.result.length < 14 ? 'lower cell' : 'cell'}> {submission.result} </div>
				 <div className = "lower cell"> {submission.timeTaken === -1 ? '???' : submission.timeTaken} ms </div>
				 <div className = "lower cell"> {submission.memoryTaken === -1 ? '???' : submission.memoryTaken} KB </div>
				 <div className = "cell"> <div> {submission.date_yyyy} </div> <div> {submission.date_hh} </div> </div>
				 <div className = "lower cell"> {submission.code.language} </div>
				</div>
			</div>
			<div className = "code-header">
				<h2>Code</h2>
				<button className = "cp-btn" onClick = {() => copyToClipboard(submission.code.content)}> Copy </button>
			</div>
			<AceEditor mode = {submission.code.language} theme = "cobalt" width = "1400px" showPrintMargin = {false} readOnly = {true} value = {submission.code.content}/>
			<h2>Testcase results</h2>
		</div>
	) : null;
};

export default Submission;
