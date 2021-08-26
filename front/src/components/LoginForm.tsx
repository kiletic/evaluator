import { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../scss/LoginForm.scss'

import AuthContext from './AuthContext';

// TODO: rework this
const LoginForm = () => {
	const [data, setData] = useState({username: "", password: ""});
	const [loginStatus, setLoginStatus] = useState("");
	const { setAuth } = useContext(AuthContext);

	const history = useHistory();

	const submitForm = (e: any) => {
		e.preventDefault();

		fetch('http://localhost:4000/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(async res => {
			if (res.status === 200) {
				setAuth(true);
				history.push('/problemset');
			} else {
				const messageJson = await res.json();
				setLoginStatus(messageJson.message);
			}
		});

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
				{loginStatus !== "" && <p style = {{color: "red", paddingTop: "40px"}}>{loginStatus}</p>}
			</form>
		</div>
	)	
}

export default LoginForm;
