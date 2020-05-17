import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import FollowingTags from "./FollowingTags";
import { AuthContext } from "../firebase/Auth";
import FollowTagButton from "./FollowTagButton";


const TagPage = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tagData,setTagData] = useState(undefined);
    const [refreshCount,setRefreshCount] = useState(0);

    const refreshData = {
        refreshCount : refreshCount,
        setRefreshCount : setRefreshCount
    }

    useEffect(() => {
        const getData = async () => {
            try{
                const {data} = await Axios.get(`${process.env.REACT_APP_backendEndpoint}tags/main/${props.match.params.id}/${currentUser.email}`);
                setTagData(data);
            } catch(e){
                setTagData(null);
            }
        }
        getData();
    },[props.match.params.id,refreshCount]);

    if(null === tagData)
        return (<Redirect to='/notfound'></Redirect>)
    
    if(undefined === tagData)
        return (<div className='loader'></div>);

    const buildHeading = () => {
        return (
            <div className="tag_heading card" key={tagData.id}>
                <img src="/imgs/tag.png" className='tag_img_main' alt='userimage'/>
                <div className="tag_heading_2">
                    <div className="tag_title title">{tagData.title}</div>
                    <FollowTagButton tagID={tagData.id} refreshData={refreshData}/>
                </div>
            </div>
        )
    }

    const buildFollowerList = () => {
        return (
            <div className='tag_body_followers'>
                <div className="tag_follower_heading">Followers</div>
                {tagData && tagData.followers.map( (follower) =>
                    <div className='tag_user' key={follower.userName}>
                        <img className="tag_user_img" src="/imgs/user.png" alt='userimage'/>
                        <div className='tag_user_name'> {follower.userName} </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="tag_body">
            <FollowingTags data={tagData.userTags} refreshData={refreshData} />
            <div className='tag_body_main'>
                {buildHeading()}
                {tagData && tagData.questions.map((q) => 
                    <QuestionCard data={q} key={q._id} />
                )}
            </div>
            {buildFollowerList()}
        </div>
    );
}

export default TagPage;