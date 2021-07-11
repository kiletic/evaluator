import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

function App() {
	const onSubmit = (data: any): void => {
		console.log(data);
	}
	
  return (
		<Router>
			<div className = "App">
				<Switch>
					<Route path = "/register">
						<RegisterForm onSubmit = {onSubmit} />
					</Route>
					<Route path = "/">
						<LoginForm onSubmit = {onSubmit} />
					</Route>
				</Switch>
			</div>
		</Router>
  );
}

export default App;
