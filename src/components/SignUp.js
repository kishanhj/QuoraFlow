import React, { useContext, useState, useEffect,useLayoutEffect } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth'
import SocialSignIn from './SocialSignIn';
import axios from 'axios';
import "./Signin.css"
// import * as settings from "../settings.json"

const settings = {
    backendEndpoint: process.env.REACT_APP_backendEndpoint
}



function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const [userNameCheck, setUserNameCheck] = useState('');
    const [userCheck, setUserCheck] = useState()
    const [uName, setUserName] = useState('')

    const addUser = async () => {
        if (currentUser && uName) {
            console.log("addUser called at signup")
            console.log(uName)
            console.log("user email:", currentUser.email)
            try {
                const payload = { name: uName, email: currentUser.email }

                let i = await currentUser.getIdToken()
                let api = settings.backendEndpoint + "users/addUser";
                let status = await axios.post(api, payload,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'Content-Type': 'application/json',
                            'authtoken': i
                        }
                    }
                );
                console.log(status)
            } catch (e) {
                console.log(e)
                alert(e);
            }
        }
    }
    
    useLayoutEffect(() => {
        const getData = async () => {
            try {
                if (currentUser) {
                    let api = settings.backendEndpoint + "users/checkUser";
                    let status = await axios.post(api, { email: currentUser.email })
                    if (!status.data.flag) {
                        if (uName) {
                            addUser()

                        }
                        setUserCheck(1)
                    }
                    else {
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
            return <Redirect to='/username' />;
        }
        else if (userCheck === 2) {
            return <Redirect to='/username' />;
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { userName, email, password1, password2 } = e.target.elements;

        try {
            let api = settings.backendEndpoint + "users/checkUserName";
            let status = await axios.post(api, { userName: userName.value });
            if (status.data.flag === false) {
                setUserNameCheck("user name already exists, please try another user name")
                return false;
            }
        }
        catch (e) {
            console.log(e)
            alert(e);
        }

        if (password1.value !== password2.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try {
            setUserName(userName.value)
            await doCreateUserWithEmailAndPassword(email.value, password1.value, userName.value);



        } catch (e) {
            console.log(e)
            alert(e);

        }
    };

    
    return (
        <div>
            <h1>
                Sign Up
            </h1>



            {pwMatch && <div className="alert alert-warning" role="alert"><strong>Warning!</strong> {pwMatch}</div>}
            {userNameCheck && <div className="alert alert-warning" role="alert"><strong>Warning!</strong> {userNameCheck}</div>}
            <form onSubmit={handleSignUp}>
                <div className='form-group'>
                    <label>
                        User Name:
                         <input className='form-control' required name='userName' type='text' placeholder='User Name'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Email:
                         <input className='form-control' required name='email' type='email' placeholder='email'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Password:
                         <input className='form-control' required id='password1' name='password1' type='password'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Confirm Password:
                         <input className='form-control' required id='password2' name='password2' type='password'></input>
                    </label>
                </div>
                <button id='submitButton' className="btn btn-primary" name='submitButton' type='submit' >Sign Up</button>
            </form>
            <br />
            <SocialSignIn></SocialSignIn>
            <br />

            <nav>
                <label class="text-secondary">Already have an account?
                    <NavLink class="reqcolor" to='/signin'> Go to Sign-in page</NavLink>
                </label>
            </nav>


        </div>
    );

}

export default SignUp;