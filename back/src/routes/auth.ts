import express from 'express';
import { onLogin, onRegister, onLogout, checkAuth } from '../controllers/auth';

var router = express.Router();

router.post('/api/login', (req, res) => {
	onLogin(req, res);
});

router.post('/api/register', (req, res) => {
	onRegister(req, res);
});

router.get('/api/logout', (req, res) => {
	onLogout(req, res);
});

router.get('/api/check-auth', (req, res) => {
	checkAuth(req, res);
});

export default router;
