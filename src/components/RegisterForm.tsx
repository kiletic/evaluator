import { useState } from 'react'
import { Link, useHistory, BrowserRouter as Route } from 'react-router-dom'
import '../scss/RegisterForm.scss'

// TODO: rework this
const RegisterForm = () => {
	const [data, setData] = useState({username: "", password: "", email: ""});
	const [registerSuccessful, setregisterSuccessful] = useState(-1);

	const history = useHistory();

	const submitForm = async (e: any) => {
		e.preventDefault();

		await fetch('http://localhost:5000/users')
		.then(res => res.json())
		.then(users => {
			let userInDB: boolean = false;	
			for (const user of users) {
				if (user.username === data.username ||
						user.password === data.password ||
						user.email === data.email) {
					userInDB = true;
					break;
				}
			}
			if (!userInDB) {  
				addUser(data);
				history.push("/");
			}	else { 
				setregisterSuccessful(0);
				setData({username: "", password: "", email: ""});
			}
		})
	}

	const addUser = async (userData: any) => {
		const res = await fetch('http://localhost:5000/users', { 
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});
		const content = await res.json()

		console.log(content);
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
				{registerSuccessful === 0 && <p style = {{color: "red", paddingTop: "10px"}}>Register was not successful.</p>}
			</form>
		</div>
	)	
}

export default RegisterForm;
