import React, { useContext, useState, useLayoutEffect } from 'react'
import SocialSignIn from './SocialSignIn'
import { Redirect, NavLink } from 'react-router-dom'
import { AuthContext } from '../firebase/Auth'
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions'
import axios from 'axios';
import "./Signin.css"
require('dotenv').config();

const settings = {
    backendEndpoint: process.env.REACT_APP_backendEndpoint
}

function SignIn() {
    const { currentUser } = useContext(AuthContext);
    const [userCheck, setUserCheck] = useState()
    useLayoutEffect(() => {
        const getData = async () => {
            try {
                if (currentUser) {
                    let api = settings.backendEndpoint + "users/checkUser";
                    let status = await axios.post(api, { email: currentUser.email })
                    if (!status.data.flag) {
                        console.log("Status flag = ", status.data.flag)
                        setUserCheck(1)
                    }
                    else {
                        console.log("Status flag = ", status.data.flag)
                        setUserCheck(2);
                    }
                }
                
            } catch (e) {
                console.log(e);
            }
            
        }
        getData();
        
    }, [currentUser]);

    

    if (currentUser != null) {
        console.log(userCheck)
        if (userCheck === 1) {
            return <Redirect to='/username' />
        }
        else if (userCheck === 2) {
            return <Redirect to='/' />;
        }
    }

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
            <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
                <button id='submitButton' name='submitButton' class="btn btn-primary" type='submit' >Sign In</button>
                <button className="btn btn-secondary" onClick={passwordReset}>Forgot Password?</button>
            </div>
                <SocialSignIn></SocialSignIn>
            </form>
        
        <br />

        <nav class="nav">

            <label class="text-secondary">New user?
                <NavLink class="reqcolor" to='/signup'> Register new account</NavLink>
            </label>

        </nav>



        <br />

    </div>);
}
export default SignIn;