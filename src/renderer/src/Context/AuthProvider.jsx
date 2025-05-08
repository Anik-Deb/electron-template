// import React, { createContext, useContext, useState } from 'react';

// // Create the AuthContext
// const AuthContext = createContext();

// // AuthProvider component
// export const AuthProvider = ({ children }) => {
//  // console.log('Reload')
//   const [authState, setAuthState] = useState({
//     user: null, // Will store { id, email } of the logged-in user
//     isLoggedIn: false, // Whether the user is logged in
//   });

//   // Simulated login function
//   const login = async ({ email, password }) => {
//     // Simulate an API call for authentication
//     // const fakeUser = {
//     //   id: '12345',
//     //   email: email,
//     // };
//     const superAdmins = await window.api.getUsers({ role: 'superAdmin' });
//     /*Todo: password hashed*/
//     const superAdmin = superAdmins.find(
//       (user) => user.email === email && user.password === password
//     );
//     // // console.log('super admin:', superAdmin);
//     if (superAdmin) {
//       // // console.log('credential:', { email, password });

//       setAuthState({ user: { email, password }, isLoggedIn: true });
//       return true;
//     } else {
//       return false;
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setAuthState({ user: null, isLoggedIn: false });
//   };

//   // Provide the context value
//   return (
//     <AuthContext.Provider value={{ authState, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const storedAuthState = sessionStorage.getItem('authState');
    return storedAuthState
      ? JSON.parse(storedAuthState)
      : { user: null, isLoggedIn: false };
  });

  useEffect(() => {
    // Save auth state to sessionStorage whenever it changes
    sessionStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);

  // Login function
  const login = async ({ email, password }) => {
    const response = await window.api.login({ email, password });
    if (response?.email) {
      const { redirectURL, ...loggedInUser } = response;
      setAuthState({ user: loggedInUser, isLoggedIn: true });
      return response;
    } else {
      return false;
    }
    // const superAdmin =
    //   superAdmins.email === email && superAdmins.password === password;

    // if (superAdmin) {
    //   const newAuthState = { user: { email, password }, isLoggedIn: true };
    //   setAuthState(newAuthState);
    //   return true;
    // } else {
    //   return false;
    // }
  };

  // Logout function
  const logout = () => {
    setAuthState({ user: null, isLoggedIn: false });
    sessionStorage.removeItem('authState'); // Clear session storage on logout
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
