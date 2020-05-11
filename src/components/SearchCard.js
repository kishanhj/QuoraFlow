import React, { useState, Fragment } from "react";
import ReactHtmlParser from 'react-html-parser'; 
import { Link } from "react-router-dom";
import FollowTagButton from "./FollowTagButton";

const stringValidator = (value) => {
    if(!value || typeof value != 'string' || value === ''){
        console.log(value);
        return false;
    }
    return true;
}

const SearchCard = (props) => {
    const [data,setData] = useState(props.data);
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
                   <img src="/imgs/tag.png" className='tag_img'/>Tag : <Link className='SearchCard_title title SearchCard_tag' to={getTagLink()}>{title}</Link>
                </div>
                <FollowTagButton tagID={data._source.id} />
            </div>
        );  
    
    return(
        <div className = 'SearchCard'>
            <div className='SearchCard_title title'> 
                <Link to={getQuestionLink()}>{title}</Link>
            </div>
            <div className='SearchCard_desc'> {description} </div>
        </div>
    );
}

export default SearchCard;