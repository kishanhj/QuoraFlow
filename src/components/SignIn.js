import React, { useContext } from 'react'
import SocialSignIn from './SocialSignIn'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../firebase/Auth'
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions'
import axios from 'axios';







function SignIn() {
    const { currentUser } = useContext(AuthContext);
    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password1 } = event.target.elements;

        try {
            await doSignInWithEmailAndPassword(email.value, password1.value);
            
        } catch (e) {
            alert(e);
        }
    }
    const passwordReset = async (event) => {
        event.preventDefault();
        let email = document.getElementById('email')
        console.log(email.value)
        if (email) {
            try {
                await doPasswordReset(email.value);
                alert('Password reset email sent')
            }
            catch (error) { alert(error.message) }

        }
    }
    //if user is authenticated redirect to main page
    if (currentUser) {
        console.log('Redirect called');
        return <Redirect to='/questions' />;
    }
    return (<div>
        <h1>
            Sign In
            </h1>

        <form onSubmit={handleLogin}>

            <div className='form-group'>
                <label>
                    Email:
                         <input className='form-control' required id='email' name='email' type='email' placeholder='email'></input>
                </label>
            </div>
            <div className='form-group'>
                <label>
                    Password:
                         <input className='form-control' required id='password1' name='password1' type='password'></input>
                </label>
            </div>

            <button id='submitButton' name='submitButton' type='submit' >Sign In</button>
        </form>
        <br />

        <button className='forgotPassword' onClick={passwordReset}>Forgot Password?</button>
        <br />
        <SocialSignIn></SocialSignIn>
    </div>);
}
export default SignIn;