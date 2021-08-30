import express from 'express';
import { Submit } from '../controllers/submit';

var router = express.Router();

router.post('/api/submit', (req, res) => {
	Submit();
});

export default router;
