import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { useHistory } from "react-router-dom";



const SignOutButton = (props) => {
    const history = useHistory();
    const SignOut=()=>{
        doSignOut()
        history.push('/signin')
        
    }
    return (
        <button type='button' onClick={SignOut}>
            Sign Out
        </button>
    );
};

export default SignOutButton;