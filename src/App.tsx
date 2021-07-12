import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

function App() {
  return (
		<Router>
			<div className = "App">
				<Switch>
					<Route path = "/home">
							
					</Route>
					<Route path = "/register">
						<RegisterForm />
					</Route>
					<Route path = "/">
						<LoginForm />
					</Route>
				</Switch>
			</div>
		</Router>
  );
}

export default App;
