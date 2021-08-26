import express from 'express';
import { onLogin, onRegister } from '../controllers/auth';

var router = express.Router();

router.post('/api/login', (req, res) => {
	onLogin(req, res);
});

router.post('/api/register', (req, res) => {
	onRegister(req, res);
});

export default router;
