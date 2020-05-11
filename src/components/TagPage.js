import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import FollowingTags from "./FollowingTags";


const TagPage = (props) => {
    // const [id,setId] = useState(props.match.params.id);
    const [tagData,setTagData] = useState(undefined);

    useEffect(() => {
        const getData = async () => {
            try{
                const {data} = await Axios.get(`http://localhost:8080/tags/main/${props.match.params.id}`);
                console.log(data);
                setTagData(data);
            } catch(e){
                setTagData(null);
            }
        }
        getData();
    },[props.match.params.id]);

    if(null === tagData)
        return (<Redirect to='/notfound'></Redirect>)
    
    if(undefined === tagData)
        return (<div className='loader'></div>);

    const getFollowLink = () => {
        if(false)
            return `Following`;
        return `Follow ${tagData.followers.length}`;
    }

    const buildHeading = () => {
        return (
            <div className="tag_heading">
                <img src="/imgs/tag.png" className='tag_img_main'/>
                <div className="tag_heading_2">
                    <div className="tag_title title">{tagData.title}</div>
                    <button className = "follow_button">{getFollowLink()}</button>
                </div>
            </div>
        )
    }

    const buildFollowerList = () => {
        return (
            <div className='tag_body_followers'>
                <h5 className="tag_follower_heading">Followers</h5>
                {tagData && tagData.followers.map( (follower) =>
                    <div className='tag_user' key={follower.userName}>
                        <img className="tag_user_img" src="/imgs/user.png" />
                        <div className='tag_user_name'> {follower.userName} </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="tag_body">
            <FollowingTags data={[{id:"5eb63a7674dfbc6c81c626b8",tag:"general"}]}/>
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