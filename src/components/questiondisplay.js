import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router , Route ,Link} from 'react-router-dom';
import Axios from 'axios';
import '../App.css';


function Questiondisplay(props) {
	
    const [ getData, setgetData ] = useState({});
    const [ gettags, settags]=useState([]);
    useEffect(
        ()=>{
        console.log("question rendered")
        async function getdata(){
            const { data }= await Axios.get(`http://localhost:8080/questions/${props.match.params.id}`)
            setgetData(data)
            settags(data.tags)
            console.log(data.image)
            
            
        }
        getdata()
        
        


    },[])
   
    if(getData && getData.image){
        return (
            <div className="App=body">
                <Link className="showlink" to={`/question/edit/${props.match.params.id}`}>Edit Question</Link>
                <br/>
                <span className="title">Title</span>
                <h1>{getData && getData.title}</h1>
                <span className="title">Description</span>
                <p>{getData && getData.description}</p>
                <br/>
                <span className="title">Image</span>
                <img src={getData && getData.image} alt="questionimage"/>
                <br/>
                <span className="title">Time</span>
                <p>{getData && getData.timestamp}</p>
                <br/>
                <span className="title">Tags</span>
                <ul>{gettags && gettags.map((tag)=>{
                    return <li key={tag}>{tag}</li>
                })}</ul>
      
            </div>
        );

    }

	return (
		<div className="App=body">
            <Link className="showlink" to='/question/edit/:id'>Edit Question</Link>
            <br/>
            <span className="title">Title</span>
            <h1>{getData && getData.title}</h1>
            <span className="title">Description</span>
            <p>{getData && getData.description}</p>
            <br/>
            <span className="title">Time</span>
            <p>{getData && getData.timestamp}</p>
            <br/>
            <span className="title">Tags</span>
            <ul>{gettags && gettags.map((tag)=>{
                return <li key={tag}>{tag}</li>
            })}</ul>
  
		</div>
	);
}

export default Questiondisplay;