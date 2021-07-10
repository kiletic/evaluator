import '../styles/LoginForm.css'

const LoginForm = () => {
	return (
		<form className = "LoginForm">
			<h2 className = "logintext"> Login </h2>
			<div className = "row"> 
				<input type = "text" placeholder = "Username"/> <br/>
			</div>
			<div className = "row"> 
			<input type = "text" placeholder = "Password"/> <br/>
			</div>
			<div className = "btn"> 
				<input type = "submit"/>
			</div>
		</form>
	)	
}

export default LoginForm;
