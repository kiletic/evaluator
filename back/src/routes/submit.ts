import express from 'express';
import { Submit, GetSubmission } from '../controllers/submit';

var router = express.Router();

router.post('/api/submit/:id', (req, res) => {
	Submit(req);
});

router.get('/api/submission/:id', async (req, res) => {
	const submission = await GetSubmission(parseInt(req.params.id));

	if (submission) {
		res.json(submission.toObject());
	} else {
		res.json({ message: `Submission with id ${req.params.id} doesn't exist.` });
	}
});

export default router;
