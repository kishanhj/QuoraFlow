import React, { useContext, useState, useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth'
import axios from 'axios';
import SignOut from "./SignOut"
import { MobileAnalytics } from 'aws-sdk';
//useEffect

function UserName() {
    const { currentUser } = useContext(AuthContext);
    const [userNameCheck, setUserNameCheck] = useState('');
    const [userCheck, setUserCheck] = useState();
    const [checkbox, setCheckbox] = useState();
    const [listDetails, setListDetails] = useState();
    const [tagCount, setCount] = useState(0)
    const [tagError, setTagError] = useState('')
    let map = new Set();

    useLayoutEffect(() => {
        console.log(userCheck)
        const getData = async () => {
            try {
                if (currentUser) {
                    let status = await axios.post("http://localhost:8080/users/checkUser", { email: currentUser.email })
                    const { data: listHashtag } = await axios.get("http://localhost:8080/tags/getalltags")
                    setListDetails(listHashtag)
                    if (!status.data.flag)
                        setUserCheck(1)
                    else {
                        setUserCheck(2);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, [currentUser, userCheck]);

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
            setUserCheck(2)
        }
        catch (e) {
            console.log(e)
            alert(e);
        }
    }

    // const handleTagSelection = async (e) => {
    //     e.preventDefault();

    // }
    const mySubmitHandler =  (event) => {
        event.preventDefault();
        if (map.size < 3) { 
            setTagError('You must select at least 3 tags')
            return false;
        }
        

        map.forEach(async id => {
            await axios.post("http://localhost:8080/users/addTagId", {email:currentUser.email, tag_id:id});
        });

        setUserCheck(3)
        
        
        
    }
    const myChangeHandler = (event) => {
        let nam = event.target.name;
        
        // setCheckbox({ [nam]: val });
        if (map.has(nam)) {
            map.delete(nam)
        }
        else { 
            map.add(nam)
        }
        console.log(map)
        
    }
/**
 * If user is not logged in 
 */
    if (!currentUser) {
        console.log('Redirect called');
        return <Redirect to='/signup'></Redirect>
    }


    

    if (userCheck === 1) {
        return (

            <div>
                <h1>Enter user name for your new account</h1>
                {userNameCheck && <div class="alert alert-warning" role="alert"><strong>Warning!</strong> {userNameCheck}</div>}
                <form onSubmit={handleUserName}>
                    <div className='form-group'>
                        <label>
                            User Name:
                         <input className='form-control' required name='userName' type='text' placeholder='User Name'></input>
                        </label>
                    </div>
                    <br />
                    <button id='submitButton' class="btn btn-primary" name='submitButton' type='submit' >Sign Up</button>
                    
                </form>
            </div>
        )
    }
    else if(userCheck === 2 && listDetails){
        return (
            <div>
                <h1>Please select tags that interest you:</h1>
                {tagError && <div class="alert alert-warning" role="alert"><strong>Warning!</strong> {tagError}</div>}
                <form onSubmit={mySubmitHandler}>
                    <ul>
                        {listDetails && listDetails.map((tag) => {
                            return <li key={tag.tag}>
                                <p>{tag.tag}
                                    <input
                                        type='checkbox'
                                        name={tag._id}
                                        value={tag.tag}
                                        onChange={myChangeHandler}
                                    />
                                </p>
                            </li>
                        }
                        )}
                    </ul>
                    <br />
                    <button id='submitButton' class="btn btn-primary" name='submitButton' type='submit' >Add Tags</button>
                </form>
            </div>

        )
    }
    else if (userCheck === 3) {
        return (
            <Redirect to="/"></Redirect>
        )
    }
    return null
    
}
export default UserName;