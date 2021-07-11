import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/LoginForm.css'

const LoginForm = ({ onSubmit } : { onSubmit: Function }) => {
	const [data, setData] = useState({username: "", password: ""});

	const submitForm = (e: any): void => {
		e.preventDefault();
		onSubmit(data);
		setData({username: "", password: ""});
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
		</form>
	)	
}

export default LoginForm;
