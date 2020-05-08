import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth'
import SocialSignIn from './SocialSignIn';
import axios from 'axios';
function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const [userNameCheck, setUserNameCheck] = useState('');
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { userName, email, password1, password2 } = e.target.elements;

        try {
            let status= await axios.post("http://localhost:8080/users/checkUserName", { userName: userName.value });
            console.log(status.data.flag)
            console.log(typeof status.data.flag)
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
            await doCreateUserWithEmailAndPassword(email.value, password1.value, userName.value);

            const payload = { name: userName.value, email: email.value }

            let status = await axios.post("http://localhost:8080/users/addUser", payload);
            console.log(status)

        } catch (e) {
            console.log(e)
            alert(e);
            
        }
    };
    //redirect to main page if user authenticated
    if (currentUser) {
        console.log('Redirect called');
        console.log(currentUser)
        return <Redirect to='/questions'></Redirect>
    }
    return (
        <div>
            <h1>
                Sign Up
            </h1>
            
            {pwMatch && <h4 className='error'>{pwMatch}</h4>}
            {userNameCheck && <h4 className='error'>{userNameCheck}</h4>}
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
                <button id='submitButton' name='submitButton' type='submit' >Sign Up</button>
            </form>
            <br />
            <SocialSignIn></SocialSignIn>
        </div>
    );

}

export default SignUp;