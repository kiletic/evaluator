import { NavLink } from 'react-router-dom'
import '../scss/Header.scss'

const Header = () => {
	return (
		<div className = "Header">
			<div className = "container">
				<div className = "logo">
					<img src = "https://i.ibb.co/JckqxQ1/tools.png"/>
					<p><strong>Evaluator</strong></p>
				</div>
				<nav>
					<ul>
						<NavLink activeClassName = "active" to = "/problemset"><li>Problemset</li></NavLink>
						<NavLink activeClassName = "active" to = "/profile"><li>Profile</li></NavLink>
						<NavLink activeClassName = "active" exact to = "/"><li>Logout</li></NavLink>
					</ul>
				</nav>
			</div>
		</div>
	)
}

export default Header;
