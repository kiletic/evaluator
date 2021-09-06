import bcrypt from 'bcrypt';
import User from '../models/user';

const onRegister = async (req: any, res: any) => {
	const { username, password, email } = req.body;

	var user = await User.findOne({ email: email });
	if (user) { 
		return res.status(403).json({ message: "Email is taken." });
	}

	user = await User.findOne({ username: username });
	if (user) { 
		return res.status(403).json({ message: "Username is taken." });
	}

	const hashedPass: String = await bcrypt.hash(password, 10);

	user = new User({
		email: email,
		username: username,
		password: hashedPass
	});
	await user.save();
	
	res.status(200).json({ message: "User registered." });
}

const onLogin = async (req: any, res: any) => {
	const { username, password } = req.body; 

	const user: any = await User.findOne({ username: username });
	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			req.session.isAuth = true;
			req.session.username = username;
			return res.status(200).json({ message: "Login successful." });
		} else {
			return res.status(403).json({ message: "Invalid password." });
		}
	}

	res.status(403).json({ message: "Invalid username." });
}

const onLogout = async (req: any, res: any) => {
	req.session.destroy();
}

const checkAuth = async (req: any, res: any) => {
	if (req.session.isAuth) {
		res.status(200).json({ isAuth: true });
	} else {
		res.status(200).json({ isAuth: false });
	}
}

export { onLogin, onRegister, onLogout, checkAuth };
