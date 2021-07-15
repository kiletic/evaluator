import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'
import Header from './components/Header'
import Task from './components/Task'
import Submit from './components/Submit'

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
				<Route path = "/problemset/submit/:id">
					<Submit />
				</Route>
				<Route path = "/problemset/stats/:id">
				</Route>
				<Route exact path = "/problemset">
					<Problemset />	
				</Route>
			</Switch>
		</Router>
  );
}

export default App;
