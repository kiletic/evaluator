import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'

function App() {
  return (
		<Router>
			<Switch>
				<Route path = "/problemset">
					<Problemset />	
				</Route>
				<Route path = "/register">
					<RegisterForm />
				</Route>
				<Route path = "/">
					<LoginForm />
				</Route>
			</Switch>
		</Router>
  );
}

export default App;
