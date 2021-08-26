import React from 'react';

const AuthContext = React.createContext({ 
	auth: false, 
	setAuth: (auth: boolean) => {} 
});

export default AuthContext;
