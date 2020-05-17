import React, { useState, useEffect, useContext } from "react";
import {Link} from "react-router-dom"
import { AuthContext } from "../firebase/Auth";
import Axios from "axios";

const FollowingTags = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tags,setTags] = useState(undefined);

    useEffect( () => {
        const getData = async () => {
            let i = await currentUser.getIdToken()
            const body = {"email" : currentUser.email};
            const {data} = await Axios.post(`${process.env.REACT_APP_backendEndpoint}users/userInfo/tags/${currentUser.email}`,
            body,{headers: {
                'accept': 'application/json',
                'authtoken': i
            }});
            setTags(data);
        }
        getData();
    },[props.refreshData.refreshCount]);

    if(undefined === tags)
        return (<div className='loader'></div>);

    const getTagLink = (id) => {
        return `/tag/${id}`;
    }

    return (
        <div className='following_tag_list' key="following_tag_list">
            <div className="tag_follower_heading">My Tags</div>
            {tags && tags.map( (tag) =>
                <Link className='following_tag' key={tag.tag} to={getTagLink(tag._id)}>
                    <img className="following_tag_img" src="/imgs/tag.png" alt='userimage'/>
                    <div className='following_tag_name title'> {tag.tag} </div>
                </Link>
            )}
        </div>
    )
}

export default FollowingTags;