import express from 'express';
import { Submit, GetSubmission, GetTaskSubmissionsByUsername } from '../controllers/submit';
import { GetTestcaseResults } from '../lib/utils';

var router = express.Router();

router.post('/api/submit/:id', async (req, res) => {
	const submissionId = await Submit(req);
	
	res.json({ "submissionId": submissionId });
});

router.get('/api/submission/:id', async (req, res) => {
	const submission = await GetSubmission(parseInt(req.params.id));

	if (submission) {
		var dateString = submission._id.getTimestamp().toISOString();
		var date_yyyy = dateString.substring(0, 10);
		var date_hh = dateString.substring(11, dateString.length - 5);

		res.json({...submission.toObject(), date_yyyy: date_yyyy, date_hh: date_hh  });
	} else {
		res.json({ message: `Submission with id ${req.params.id} doesn't exist.` });
	}
});

router.get('/api/submission/:id/tcRes', async (req, res) => {
	const submission: any = await GetSubmission(parseInt(req.params.id));

	if (submission) {
		const results = await GetTestcaseResults(parseInt(req.params.id), submission.testcaseResults, submission.task.id); 

		res.json(results);
	} else {
		res.json({ message: `Submission with id ${req.params.id} doesn't exist.` });
	}
});

router.get('/api/submissions/:taskId/user', async (req: any, res: any) => {
	var submissions: Array<any> = await GetTaskSubmissionsByUsername(parseInt(req.params.taskId), req.session.username);

	// sort by date
	submissions.sort((x: any, y: any) => {
		if (x._id.getTimestamp() < y._id.getTimestamp()) {
			return 1;
		}
		return -1;
	});
	if (submissions.length > 10) {
		submissions = submissions.slice(0, 10);
	}
	submissions = submissions.map((submission: any) => { 
		var dateString = submission._id.getTimestamp().toISOString();
		var date_yyyy = dateString.substring(0, 10);
		var date_hh = dateString.substring(11, dateString.length - 5);

		return { date: date_yyyy + ' ' + date_hh, result: submission.result, id: submission.submissionId }
	});


	res.json({ submissions: submissions });
});

export default router;
