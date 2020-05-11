import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter as Router , Route ,Link,Redirect} from 'react-router-dom';
import Axios from 'axios';
import { AuthContext } from '../firebase/Auth'
import '../App.css';



function Deletequestion(props){
    const { currentUser } = useContext(AuthContext);
    const [isOwner ,setisOwner] =useState(undefined)
    const [ postData, setpostData]=useState(true);
    const [hasdeleted,sethasdeleted]=useState(false)
    const [ getData, setgetData ] = useState({});
    useEffect(
        ()=>{
            async function getdata(){
                try{
                    const { data }= await Axios.get(`http://localhost:8080/questions/${props.match.params.id}`)
                    setgetData(data)
                    if(currentUser!==undefined && data.userid===currentUser.email){
                        sethasdeleted(true)
                        setisOwner({isowner:true})
                        const { } = await Axios.delete(`http://localhost:8080/questions/${props.match.params.id}`)
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
                        console.log(e.response.status);
                        console.log(e.response.headers);
                
                    }
                }
                
            }
            getdata()   

        }
    ,[])

    if(currentUser===undefined){
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