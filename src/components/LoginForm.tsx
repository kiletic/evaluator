import { userInfo } from 'os';
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../scss/LoginForm.scss'

// TODO: rework this
const LoginForm = () => {
	const [data, setData] = useState({username: "", password: ""});
	const [loginSuccessful, setloginSuccessful] = useState(-1);

	const history = useHistory();

	const submitForm = async (e: any) => {
		e.preventDefault();

		await fetch('http://localhost:5000/users')
		.then(res => res.json())
		.then(users => {
			let userInDB : boolean = false;
			for (const user of users) { 
				if (user.username === data.username && user.password === data.password) {
					userInDB = true;
					break;
				}
			}
			if (userInDB) {
				console.log("You can login.");
				history.push("/problemset");
			} else {
				console.log("You cannot login.");
				setloginSuccessful(0);
				setData({username: "", password: ""});
			}
		})	
	}

	return (
		<div className = "LoginForm">
			<form className = "box" onSubmit = {submitForm}>
				<h2> LOGIN </h2>
				<input type = "text" placeholder = "Username" onChange = {e => { setData({...data, username: e.target.value}); }} value = {data.username} />
				<input type = "password" placeholder = "Password" onChange = {e => { setData({...data, password: e.target.value}); }} value = {data.password} />
				<input type = "submit"/>
				<Link to = "/register" >
					Register	
				</Link>
				{loginSuccessful === 0 && <p style = {{color: "red", paddingTop: "40px"}}>Login was not successful.</p>}
			</form>
		</div>
	)	
}

export default LoginForm;
