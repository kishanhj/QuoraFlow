import React, { useState,useEffect} from 'react'
import firebaseApp from './Firebase'

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect( () => { 
        //when user is not logged in or just logged in 
        
        firebaseApp.auth().onAuthStateChanged(setCurrentUser);
    }, []);
    
    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
};
