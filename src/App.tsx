import { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

function App() {
	const [state, changeState] = useState("login");

	const onSubmit = (data: any): void => {
		console.log(data);
	}
	
	const onchangeState = () => {
		if (state === "login")
			changeState("register");
		else
			changeState("login");
	}

  return (
    <div className = "App">
			{state === "login" 
			? <LoginForm onSubmit = {onSubmit} onchangeState = {onchangeState} />
			: <RegisterForm onSubmit = {onSubmit} onchangeState = {onchangeState} />}
    </div>
  );
}

export default App;
