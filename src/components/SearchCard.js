import React, { useState } from "react";
import ReactHtmlParser from 'react-html-parser'; 
import { Link } from "react-router-dom";
import FollowTagButton from "./FollowTagButton";

const SearchCard = (props) => {
    const [data,] = useState(props.data);
    const [refreshCount,setRefreshCount] = useState(0);

    const refreshData = {
        refreshCount : refreshCount,
        setRefreshCount : setRefreshCount
    }
    var title = data._source.title,description = data._source.description;

    if(data.highlight.title) title = ReactHtmlParser(data.highlight.title);
    if(data.highlight.description) description = ReactHtmlParser(data.highlight.description);

    const getQuestionLink = () => {
        return `/questions/display/${data._source.id}`;
    }

    const getTagLink = () => {
        return `/tag/${data._source.id}`;
    }


    if(data._type === 'tags')
        return(
            <div className = 'SearchCard'>
                <div className='SearchCard_title_wrap'> 
                   <img src="/imgs/tag.png" alt='img' className='tag_img'/>Tag : <Link className='SearchCard_title title SearchCard_tag' to={getTagLink()}>{title}</Link>
                </div>
                <FollowTagButton tagID={data._source.id} refreshData={refreshData}/>
            </div>
        );  
    
    return(
        <div className = 'SearchCard'>
            <div className='SearchCard_title title'> 
                <Link className='SearchCard_title' to={getQuestionLink()}>{title}</Link>
            </div>
            <div className='SearchCard_desc'> {description} </div>
        </div>
    );
}

export default SearchCard;