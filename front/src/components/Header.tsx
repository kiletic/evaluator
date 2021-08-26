import { useContext } from 'react';
import { NavLink } from 'react-router-dom'
import '../scss/Header.scss'

import AuthContext from './AuthContext';

const Header = () => {
	const { setAuth } = useContext(AuthContext);

	return (
		<div className = "Header">
			<div className = "container">
				<span>
					<div><img src = "https://i.ibb.co/JckqxQ1/tools.png" alt = "logo"/></div>
					<p>Evaluator</p>
				</span>
				<nav>
					<ul>
						<NavLink activeClassName = "active" to = "/problemset"><li>Problemset</li></NavLink>
						<NavLink activeClassName = "active" to = "/profile"><li>Profile</li></NavLink>
						<NavLink activeClassName = "active" exact to = "/login" onClick = {() => setAuth(false) }><li>Logout</li></NavLink>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Header;
