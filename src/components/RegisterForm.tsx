import { useState } from 'react'
import '../styles/RegisterForm.css'

const RegisterForm = ({ onSubmit, onchangeState } : { onSubmit: Function, onchangeState: Function }) => {
	const [data, setData] = useState({username: "", password: "", email: ""});

	const submitForm = (e: any): void => {
		e.preventDefault();
		onSubmit(data);
		setData({username: "", password: "", email: ""});
	}

	return (
		<form className = "RegisterForm" onSubmit = {submitForm}>
			<h2 className = "registertext"> Register </h2>
			<div className = "row"> 
				<input type = "username" placeholder = "Username" onChange = {e => { setData({...data, username: e.target.value}); }} value = {data.username} />
			</div>
			<div className = "row"> 
				<input type = "password" placeholder = "Password" onChange = {e => { setData({...data, password: e.target.value}); }} value = {data.password} />
			</div>
			<div className = "row"> 
				<input type = "email" placeholder = "Email" onChange = {e => { setData({...data, email: e.target.value}); }} value = {data.email} />
			</div>
			<div className = "btn"> 
				<input type = "submit"/>
			</div>
			<a href = "#" onClick = {onchangeState}>
				Login	
			</a>
		</form>
	)	
}

export default RegisterForm;
