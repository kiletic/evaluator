import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useState } from 'react'; 

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'
import Header from './components/Header'
import Task from './components/Task'
import Submit from './components/Submit'

import AuthContext from './components/AuthContext';

function App() {
	const [auth, setAuth] = useState(false);

  return (
		<AuthContext.Provider value = {{ auth, setAuth }}> 
			<Router>
				<Route render = {({ location }) => 
					location.pathname !== "/login" && location.pathname !== "/register"
					? <Header />
					: null } />
					{!auth ? (
						<Switch>
							<Route path = "/login" component = {LoginForm} />
							<Route path = "/register" component = {RegisterForm} />
							<Redirect to = "login" />
						</Switch>
					) : (
						<Switch>
							<Route path = "/register" component = {RegisterForm} />
							<Route exact path = "/"> <Redirect to = "/problemset"/> </Route>
							<Route path = "/problemset/tasks/:id" component = {Task} />
							<Route path = "/problemset/submit/:id" component = {Submit} />
							<Route path = "/problemset/stats/:id" />
							<Route exact path = "/problemset" component = {Problemset} />
						</Switch>
					)}
			</Router>
		</AuthContext.Provider>
  );
}

export default App;
