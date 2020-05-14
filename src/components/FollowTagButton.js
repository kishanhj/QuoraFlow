import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../firebase/Auth";

const FollowTagButton = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tagData,setTagData] = useState(undefined);
    var doesUserFollow = false;

    useEffect(() => {
        const getData = async () => {
            const {data} = await Axios.get(`http://localhost:8080/tags/followers/${props.tagID}`);
            setTagData(data)
        }
        getData();
    },[props.refreshData.refreshCount]);

    if(undefined === tagData)
        return (<div className='loader'></div>);

    const getFollowLink = () => {
        for(var i = 0; i < tagData.length; i++) {
            if (tagData[i].email === currentUser.email) {
                doesUserFollow = true;
                break;
            }
        }

        if(doesUserFollow)
            return `Following  ${tagData.length}`;
        return `Follow ${tagData.length}`;
    }

    const onClick = async () => {
        const body = {
            "tag_id" : props.tagID,
            "email" : currentUser.email
        }

        if(doesUserFollow)
            await Axios.post(`http://localhost:8080/users/removeTagId`,body);
        else
            await Axios.post(`http://localhost:8080/users/addTagId`,body);

        props.refreshData.setRefreshCount(props.refreshData.refreshCount+1);
    }

    return (  
        <button className = "follow_button" onClick = {() => onClick()}> 
            {getFollowLink()} </button>
    );
}

export default FollowTagButton;