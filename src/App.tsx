import LoginForm from './components/LoginForm'

function App() {
	const onLogin = (data: any) => {
		console.log(data);
	}

  return (
    <div className="App">
			<LoginForm onLogin = {onLogin} />
    </div>
  );
}

export default App;
