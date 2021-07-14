import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'
import Header from './components/Header'
import Task from './components/Task'

function App() {
  return (
		<Router>
			<Route render = {({ location }) => 
				location.pathname !== "/" && location.pathname !== "/register"
				? <Header />
				: null } />
			<Switch>
				<Route path = "/register">
					<RegisterForm />
				</Route>
				<Route exact path = "/">
					<LoginForm />
				</Route>
				<Route path = "/problemset/tasks/:id">
					<Task />
				</Route>
				<Route exact path = "/problemset">
					<Problemset />	
				</Route>
			</Switch>
		</Router>
  );
}

export default App;
