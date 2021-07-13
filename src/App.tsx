import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'
import Header from './components/Header'

function App() {
	console.log(window.location.pathname);
  return (
		<Router>
			<Switch>
				<Route path = "/register">
					<RegisterForm />
				</Route>
				<Route exact path = "/">
					<LoginForm />
				</Route>
				<div>
					<Header />
					<Route path = "/problemset">
						<Problemset />	
					</Route>
				</div>
			</Switch>
		</Router>
  );
}

export default App;
