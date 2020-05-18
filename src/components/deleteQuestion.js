import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter as Redirect} from 'react-router-dom';
import Axios from 'axios';
import { AuthContext } from '../firebase/Auth'
import '../App.css';


function Deletequestion(props){
    const { currentUser } = useContext(AuthContext);
    const [isOwner ,setisOwner] =useState(undefined)
    const [ postData, setpostData]=useState(true);
    const [hasdeleted,sethasdeleted]=useState(false)
    const [ , setgetData ] = useState({});
    useEffect(
        ()=>{
            async function getdata(){
                try{
                    let api=process.env.REACT_APP_backendEndpoint + "questions/"+props.match.params.id;
                    const { data }= await Axios.get(api)
                    let adminapi=process.env.REACT_APP_backendEndpoint + "users/isAdmin";
                    const admin= await Axios.post(adminapi, {email:currentUser.email});
                    setgetData(data)
                    if(currentUser!==null){
                        if(data.userid===currentUser.email || admin.data.flag){
                            setisOwner({isowner:true})
                            let i = await currentUser.getIdToken()
                            await Axios.delete(api,
                                {headers: {
                                    'accept': 'application/json',
                                    'Accept-Language': 'en-US,en;q=0.8',
                                    'Content-Type': 'multipart/form-data',
                                    'authtoken': i
                                }})
                            sethasdeleted(true)
                            let oldtags=[]
                            for(let i=0;i<data.tags.length;i++){
                                oldtags.push(data.tags[i].tag)
                            }
                            let atagapi=process.env.REACT_APP_backendEndpoint + "tags/removetags";
                            await Axios.patch(atagapi,
			                        {"tagarray":oldtags,"questionID":data._id}
			                        ,{headers: {
					                        'accept': 'application/json',
					                        'authtoken': i
			                                    }}		
			                        )

                        }
                        
                    }
                    else{
                        setisOwner({isowner:false})
                    }

                }
                catch(e){
                    setpostData(false)
                    if (e.response) {
                        /*
                        * The request was made and the server responded with a
                        * status code that falls out of the range of 2xx
                        */
                        console.log(e.response.data);
                
                    }
                }
                
            }
            getdata()   

        }
    ,[props.match.params.id])

    if(currentUser===null){
        return <Redirect to='/signin'></Redirect>
    }

    if(postData===false){
        return(<Redirect to='/notfound'/>)
    }
    
    if(isOwner && isOwner.isowner===false){
        return(<Redirect to='/notfound'/>)
    }
    
    return(
        <div>
             {hasdeleted?<div>
        <h1>the Question has been deleted</h1>
            </div>:<h1>the Question has not been deleted</h1>}

        </div>
     
    )
 

            

        
        
    
    
}

export default Deletequestion;