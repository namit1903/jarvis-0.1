import React, { createContext, useState, useContext,useEffect } from 'react';
import Cookies from 'js-cookie'

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
   // On app load, check if user data exists in cookies
   useEffect(() => {
    // const storedUser = Cookies.get('user') // Retrieve user from cookie
const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser)) // Parse and set the user
    }
}, [])
   // When user data changes, update cookies
   useEffect(() => {
    if (user) {
        Cookies.set('user', JSON.stringify(user), { expires: 7 }) // Set user in cookies (7 days expiration)
    } else {
        Cookies.remove('user') // Remove user data from cookies if null
    }
}, [user])
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};