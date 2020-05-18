import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';
import Axios from 'axios'

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            async function getdata() {
                let api=process.env.REACT_APP_backendEndpoint + "users/checkuser";
                let i = await user.getIdToken()
                const checkuser= await Axios.post(api,{email:user.email})
                console.log("hello",checkuser)
                    if(checkuser.data.flag==false){
                        console.log("display",user.displayName)
                        const payload = { name: user.uid, email: user.email,isnewUser:true }

                        let i = await user.getIdToken()
                        let api = process.env.REACT_APP_backendEndpoint + "users/addUser";
                        let check = await Axios.post(api, payload,
                        {
                            headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'Content-Type': 'application/json',
                            'authtoken': i
                        }
                        
                        }
                    );
                    
            console.log(check)
                    }
                   
                

            }
            if(user && user.displayName!==null){
                getdata()

            }
            
            setLoadingUser(false);
        });
    }, []);

    if (loadingUser) {
        return <div>Loading....</div>;
    }

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};