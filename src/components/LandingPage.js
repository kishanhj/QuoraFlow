import React, { useState, useEffect, useContext } from "react"
import Axios from "axios";
import { AuthContext } from '../firebase/Auth'
import { Redirect } from "react-router-dom";
import FollowingTags from "./FollowingTags";
import QuestionCard from "./QuestionCard";

const LandingPage = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [userData,setUserData] = useState(undefined);

    useEffect(() => {
        const getData = async () => {
            const {data} = await Axios.get(`http://localhost:8080/users/userInfo/${currentUser.email}`);
            setUserData(data);
        }
        getData();
    },[]);

    
    if(null === userData)
        return (<Redirect to='/notfound'></Redirect>)
    
    if(undefined === userData)
        return (<div className='loader'></div>);

    return(
        <div className="tag_body">
            <FollowingTags data={userData.tags}/>
            <div className='tag_body_main'>
                {userData && userData.questions.map((q) => 
                    <QuestionCard data={q} key={q._id} />
                )}
            </div>
        </div>
    )

    
}

export default LandingPage;