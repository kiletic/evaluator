import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Problemset from './components/Problemset'
import Header from './components/Header'
import Task from './components/Task'
import Submit from './components/Submit'

import AuthContext from './components/AuthContext';

function App() {
	const [auth, setAuth] = useState(false);
	const [checkForAuth, setCheckForAuth] = useState(false);

	useEffect(() => {
		console.log('Calling get req to /api/check-auth');
		fetch('http://localhost:4000/api/check-auth', { 
			method: "GET",
		}).then(res => res.json())
			.then(data => {
				setAuth(data.isAuth);
				setCheckForAuth(true);
				console.log('Auth is set to ', data.isAuth);
			});
	}, []);

  return (
		<AuthContext.Provider value = {{ auth, setAuth }}> 
			{checkForAuth &&
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
								<Route path = "/login"> <Redirect to = "/problemset"/> </Route>
								<Route path = "/problemset/tasks/:id" component = {Task} />
								<Route path = "/problemset/submit/:id" component = {Submit} />
								<Route path = "/problemset/stats/:id" />
								<Route exact path = "/problemset" component = {Problemset} />
							</Switch>
						)}
				</Router>
			}
		</AuthContext.Provider>
  );
}

export default App;
