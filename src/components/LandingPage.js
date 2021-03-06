import React, { useState, useEffect, useContext } from "react"
import Axios from "axios";
import { AuthContext } from '../firebase/Auth'
import { Redirect } from "react-router-dom";
import FollowingTags from "./FollowingTags";
import QuestionCard from "./QuestionCard";

const LandingPage = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [userData,setUserData] = useState(undefined);
    const [refreshCount,setRefreshCount] = useState(0);
    const [loginRedirect,setLoginRedirect] = useState(false);

    const refreshData = {
        refreshCount : refreshCount,
        setRefreshCount : setRefreshCount
    }

    useEffect(() => {
        const getData = async () => {
            if(currentUser){
            let i = await currentUser.getIdToken();
            let answerPage = undefined !== props.answerPage;
            let myQuestions = undefined !== props.myQuestions;
            const body = {"email" : currentUser.email,"answerPage" : answerPage,"myQuestions":myQuestions };
            const {data} = await Axios.post(`${process.env.REACT_APP_backendEndpoint}users/userInfo/${currentUser.email}`,
                body,{headers: {
					'accept': 'application/json',
					'authtoken': i
				}
            });
                setUserData(data);
            } else {
                let answerPage = undefined !== props.answerPage;
                let myQuestions = undefined !== props.myQuestions;
                if(answerPage || myQuestions) { 
                    setLoginRedirect(true);
                    return;
                }
                const {data} = await Axios.get(`${process.env.REACT_APP_backendEndpoint}users/userInfo/guest`);
                setUserData(data);
            } 
        }
        getData();
    },[]);

    
    if(null === userData)
        return (<Redirect to='/notfound'></Redirect>)

    if(loginRedirect)
        return (<Redirect to='/signin'></Redirect>)
    
    if(undefined === userData)
        return (<div  className='loader'></div>);

    const buildFollowingTags = () => {
        if(currentUser)
            return <FollowingTags refreshData={refreshData}/>
    }

    return(
        <div className="tag_body">
            {buildFollowingTags()}
            <div className='tag_body_main'>
                {userData && userData.questions.map((q) => 
                    <QuestionCard data={q} key={q._id} />
                )}
            </div>
        </div>
    )

    
}

export default LandingPage;