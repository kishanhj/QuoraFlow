import React, { useState, useEffect, useContext } from "react";
import {Link} from "react-router-dom"
import { AuthContext } from "../firebase/Auth";
import Axios from "axios";

const FollowingTags = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tags,setTags] = useState(undefined);

    useEffect( () => {
        const getData = async () => {
            const {data} = await Axios.get(`http://localhost:8080/users/userInfo/tags/${currentUser.email}`);
            setTags(data);
        }
        getData();
    },[props.refreshData.refreshCount]);

    if(undefined == tags)
        return (<div className='loader'></div>);

    const getTagLink = (id) => {
        return `/tag/${id}`;
    }

    return (
        <div className='following_tag_list' key="following_tag_list">
            {tags && tags.map( (tag) =>
                <Link className='following_tag' key={tag.tag} to={getTagLink(tag._id)}>
                    <img className="following_tag_img" src="/imgs/tag.png" />
                    <div className='following_tag_name title'> {tag.tag} </div>
                </Link>
            )}
        </div>
    )
}

export default FollowingTags;