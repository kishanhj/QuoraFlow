import React, { useContext, useState, useLayoutEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth'
import axios from 'axios';

//useEffect

function UserName() {
    const { currentUser } = useContext(AuthContext);
    const [userNameCheck, setUserNameCheck] = useState('');
    const [userCheck, setUserCheck] = useState();
    const [listDetails, setListDetails] = useState();
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

            let i = await currentUser.getIdToken()
            let check = await axios.post("http://localhost:8080/users/addUser", payload,
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
        
//add header current user auth token
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
                <h1>Please select tags that you are interested in:</h1>
                {tagError && <div class="alert alert-warning" role="alert"><strong>Warning!</strong> {tagError}</div>}
                <form onSubmit={mySubmitHandler}>
                    <div className='form-group'>
                    <ul >
                        {listDetails && listDetails.map((tag) => {
                            return <li key={tag.tag}>
                                <p>
                                    <input
                                        type='checkbox'
                                        className="form-check-input"
                                        id={tag._id}
                                        name={tag._id}
                                        value={tag.tag}
                                        onChange={myChangeHandler}
                                    />
                                    <label className="form-check-label" for={tag._id}>{tag.tag}</label>
                                </p>
                            </li>
                        }
                        )}
                    </ul>
                    <br />
                    <button id='submitButton' className="btn btn-primary" name='submitButton' type='submit' >Add Tags</button>
                    </div>
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