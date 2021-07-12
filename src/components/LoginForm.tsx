import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../styles/LoginForm.css'

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
				history.push("/home");
			} else {
				console.log("You cannot login.");
				setloginSuccessful(0);
				setData({username: "", password: ""});
			}
		})	
	}

	return (
		<form className = "LoginForm" onSubmit = {submitForm}>
			<h2 className = "logintext"> Login </h2>
			<div className = "row"> 
				<input type = "username" placeholder = "Username" onChange = {e => { setData({...data, username: e.target.value}); }} value = {data.username} />
			</div>
			<div className = "row"> 
				<input type = "password" placeholder = "Password" onChange = {e => { setData({...data, password: e.target.value}); }} value = {data.password} />
			</div>
			<div className = "btn"> 
				<input type = "submit"/>
			</div>
			<Link to = "/register">
				Register	
			</Link>
			{loginSuccessful === 0 && <p style = {{color: "red"}}>Login was not succesfull.</p>}
		</form>
	)	
}

export default LoginForm;
