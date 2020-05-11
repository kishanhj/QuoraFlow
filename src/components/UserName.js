import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth'
import axios from 'axios';
//useEffect

function UserName() {
    const { currentUser } = useContext(AuthContext);
    const [userNameCheck, setUserNameCheck] = useState('');
    const [userCheck, setUserCheck] = useState(false);
    const handleUserName = async (e) => { 
        e.preventDefault();
        const { userName } = e.target.elements;
        try {
            let status = await axios.post("http://localhost:8080/users/checkUserName", { userName: userName.value });
            console.log(status.data.flag)
            console.log(typeof status.data.flag)
            if (status.data.flag === false) {
                setUserNameCheck("user name already exists, please try another user name")
                return false;
            }
            
            const payload = { name: userName.value, email: currentUser.email }

            let check = await axios.post("http://localhost:8080/users/addUser", payload);
            console.log(check)
            setUserCheck(true)
        }
        catch (e) {
            console.log(e)
            alert(e);
        }
    }
    if (!currentUser) {
        console.log('Redirect called');
        return <Redirect to='/signup'></Redirect>
    }
    if(userCheck) { 
        return <Redirect to='/questions'></Redirect>
    }
    
    return (
        <div>
            <h1>Enter user name</h1>
            {userNameCheck && <h4 className='error'>{userNameCheck}</h4>}
            <form onSubmit={handleUserName}>
                <div className='form-group'>
                    <label>
                        User Name:
                         <input className='form-control' required name='userName' type='text' placeholder='User Name'></input>
                    </label>
                </div>
                <br />
                <button id='submitButton' name='submitButton' type='submit' >Sign Up</button>
            </form>
        </div>
    )
}
export default UserName;