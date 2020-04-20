import React,{useState,useEffect} from 'react';
import axios from 'axios';
import '../App.css';



function Deletequestion(props){
    useEffect(
        ()=>{
            async function deletedata(){
                const { data }= await axios.delete(`http://localhost:8080/questions/${props.match.params.id}`)
                
                
            }
        deletedata()   

        }
    ,[])
    return(
        <div>
            <h1>the Question has been deleted</h1>
        </div>
    )
}

export default Deletequestion;