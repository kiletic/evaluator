import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../scss/RegisterForm.scss'

// TODO: rework this
const RegisterForm = () => {
	const [data, setData] = useState({username: "", password: "", email: ""});
	const [registerStatus, setRegisterStatus] = useState("");

	const history = useHistory();

	const submitForm = (e: any) => {
		e.preventDefault();

		fetch('http://localhost:4000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(async (res: any) => {
			if (res.status === 403) {
				const messageJson = await res.json();	
				setRegisterStatus(messageJson.message);
			} else {
				history.push('/');
			}
		});
	}
	
	return (
		<div className = "RegisterForm">
			<form className = "box" onSubmit = {submitForm}>
				<h2>REGISTER</h2>
				<input type = "text" placeholder = "Username" onChange = {e => { setData({...data, username: e.target.value}); }} value = {data.username} />
				<input type = "password" placeholder = "Password" onChange = {e => { setData({...data, password: e.target.value}); }} value = {data.password} />
				<input type = "email" placeholder = "Email" onChange = {e => { setData({...data, email: e.target.value}); }} value = {data.email} />
				<input type = "submit"/>
				<Link to = "/">
					Login	
				</Link>
				{registerStatus !== "" && <p style = {{color: "red", paddingTop: "10px"}}>{registerStatus}</p>}
			</form>
		</div>
	)	
}

export default RegisterForm;
