import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Problemset from './components/Problemset';
import Header from './components/Header';
import Task from './components/Task';
import Submit from './components/Submit';
import Submission from './components/Submission';

import AuthContext from './components/AuthContext';

function App() {
	const [auth, setAuth] = useState(true);
	const [checkForAuth, setCheckForAuth] = useState(true);

	useEffect(() => {
		return;
		fetch('http://localhost:4000/api/check-auth', { 
			method: "GET",
		}).then(res => res.json())
			.then(data => {
				setAuth(data.isAuth);
				setCheckForAuth(true);
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
								<Redirect exact to = "/login" />
							</Switch>
						) : (
							<Switch>
								<Route path = "/register" component = {RegisterForm} />
								<Redirect exact from = "/" to = "/problemset"/>
								<Redirect exact from = "/login" to = "/problemset"/>
								<Route path = "/problemset/tasks/:id" component = {Task} />
								<Route path = "/problemset/submit/:id" component = {Submit} />
								<Route path = "/problemset/stats/:id" />
								<Route path = "/submission/:id" component = {Submission} />
								<Route exact path = "/problemset" component = {Problemset} />
							</Switch>
						)}
				</Router>
			}
		</AuthContext.Provider>
  );
}

export default App;
