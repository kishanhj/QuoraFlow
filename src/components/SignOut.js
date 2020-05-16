import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button'


const SignOutButton = (props) => {
    const history = useHistory();
    const SignOut=()=>{
        doSignOut()
        history.push('/signup')
        
        
    }
    return (
        <Button variant="outline-info" onClick={SignOut}>
            Sign Out
        </Button>
    );
};

export default SignOutButton;