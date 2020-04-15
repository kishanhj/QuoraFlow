import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth'
import SocialSignIn from './SocialSignIn';
function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    console.log(currentUser);
    const handleSignUp = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password1, password2 } = e.target.elements;
        if (password1.value !== password2.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try {
            await doCreateUserWithEmailAndPassword(email.value, password1.value, firstName);
        } catch (e) {
            alert(e);
        }
    };

    if (currentUser) {
        console.log('Redirect called');
        return <Redirect to='/questions'></Redirect>
    }
    return (
        <div>
            <h1>
                Sign Up
            </h1>
            {pwMatch && <h4 className='error'>{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
                <div className='form-group'>
                    <label>
                        First Name:
                         <input className='form-control' required name='firstName' type='text' placeholder='First Name'></input>
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Last Name:
                         <input className='form-control' required name='lastName' type='text' placeholder='Last Name'></input>
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
                <button id='submitButton' name='submitButton' type='submit' >Sign Up</button>
            </form>
            <br />
            <SocialSignIn></SocialSignIn>
        </div>
    );

}

export default SignUp;