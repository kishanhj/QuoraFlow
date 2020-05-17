import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../firebase/Auth";

const FollowTagButton = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [tagData,setTagData] = useState(undefined);
    var doesUserFollow = false;

    useEffect(() => {
        const getData = async () => {
            const {data} = await Axios.get(`${process.env.REACT_APP_backendEndpoint}tags/followers/${props.tagID}`);
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

        
        let i = await currentUser.getIdToken()
        const headers = {headers: {
            'accept': 'application/json',
            'authtoken': i
        } }

        if(doesUserFollow)
            await Axios.post(`${process.env.REACT_APP_backendEndpoint}users/removeTagId`,body,headers);
        else
            await Axios.post(`${process.env.REACT_APP_backendEndpoint}users/addTagId`,body,headers);

        props.refreshData.setRefreshCount(props.refreshData.refreshCount+1);
    }

    return (  
        <button className = "follow_button" onClick = {() => onClick()}> 
            {getFollowLink()} </button>
    );
}

export default FollowTagButton;