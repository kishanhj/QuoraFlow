import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../firebase/Auth";

const FollowTagButton = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tagData,setTagData] = useState(undefined);
    var doesUserFollow = false;
    var clickChange = true;

    useEffect(() => {
        if(!clickChange) return;
        const getData = async () => {
            const {data} = await Axios.get(`http://localhost:8080/tags/followers/${props.tagID}`);
            setTagData(data)
            clickChange = false;
        }
        getData();
    });

    if(undefined == tagData)
        return (<div className='loader'></div>);

    const getFollowLink = () => {
        for(var i = 0; i < tagData.length; i++) {
            if (tagData[i].email == currentUser.email) {
                doesUserFollow = true;
                break;
            }
        }

        if(doesUserFollow)
            return `Following  ${tagData.length}`;
        return `Follow ${tagData.length}`;
    }

    const onClick = () => {
        const body = {
            "tag_id" : props.tagID,
            "email" : currentUser.email
        }

        if(doesUserFollow)
            Axios.post(`http://localhost:8080/users/removeTagId`,body);
        else
            Axios.post(`http://localhost:8080/users/addTagId`,body);

        clickChange = true;
    }

    return (  
        <button className = "follow_button" onClick = {() => onClick()}>
            {getFollowLink()} </button>
    );
}

export default FollowTagButton;