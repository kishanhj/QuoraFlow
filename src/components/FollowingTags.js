import React, { useState } from "react";
import {Link} from "react-router-dom"

const FollowingTags = (props) => {
    const [tags,setTags] = useState(props.data);
    //console.log(props);

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