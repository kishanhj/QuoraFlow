import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router , Route ,Link,Redirect} from 'react-router-dom';
import Axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'



function Questiondisplay(props) {
	
    const [ getData, setgetData ] = useState({});
    const [ gettags, settags]=useState([]);
    const [ postData, setpostData]=useState(true);
    const [timestamp, settimestamp]=useState(undefined)
    const [like ,setlike]=useState(0)
    useEffect(
        ()=>{
       
        console.log("question rendered")
        async function getdata(){
            try{
                const { data }= await Axios.get(`http://localhost:8080/questions/${props.match.params.id}`)
               
                setgetData(data)
                settags(data.tags)
                setlike(data.likes.length)
                console.log(new Date(data.timestamp).toUTCString())
                settimestamp(new Date(data.timestamp).toUTCString())
                
               
               
            }
            catch(e){
                setpostData(false)
                console.log(e)
            }
            
            
        }
        getdata()
        
        


    },[props.match.params.id])

    const handlelike=(e)=>{
        const userid="testuserid68"
        async function addlike(){
            try{
                const { data }  = await Axios.patch(`http://localhost:8080/questions/like/${props.match.params.id}/${userid}`)
                console.log(data)
                setlike(data.likes.length)
            }
            catch(e){
                console.log("could not update like")
            }

        }
        addlike()
        

    }

    if(postData===false){
        return(<Redirect to='/notfound'/>)
    }
    if(getData && getData.isdeleted===true){
        return (<Redirect to='/notfound'/>)

    }
   
    if(getData && getData.image){
        return (
            <div className="App=body">
                <Nav variant="pills" >
                    <Nav.Item>
                        <Nav.Link href={`/questions/edit/${props.match.params.id}`}>Edit Question</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`/questions/delete/${props.match.params.id}`}>Delete Question</Nav.Link>
                    </Nav.Item>
                </Nav>
                <h1>{getData && getData.title}</h1>
                <hr/>
                <span className="title">Description</span>
                <p>{getData && getData.description}</p>
                <br/>
                <span className="title">Image</span>
                <Image src={`${getData && getData.image}`} thumbnail/>
                {/* <img src={getData && getData.image} alt="questionimage"/> */}
                <br/>
                <span className="title">Time</span>
                <p>{timestamp}</p>
                <br/>
                <span className="title">Tags</span>
                <ul>{gettags && gettags.map((tag)=>{
                    return <li key={tag}>{tag}</li>
                })}</ul>
                <button onClick={handlelike}>Likes {like} </button>
            </div>
        );

    }

	return (
		<div className="App-body">
            <Nav variant="pills" >
                    <Nav.Item>
                        <Nav.Link href={`/questions/edit/${props.match.params.id}`}>Edit Question</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`/questions/delete/${props.match.params.id}`}>Delete Question</Nav.Link>
                    </Nav.Item>
            </Nav>
            <span className="title">Title</span>
            <h1>{getData && getData.title}</h1>
            <span className="title">Description:</span>
            <p>{getData && getData.description}</p>
            <br/>
            <span className="title">Time</span>
            <p>{timestamp}</p>
            <br/>
            <span className="title">Tags</span>
            <ul className="tag">{gettags && gettags.map((tag)=>{
                return <li key={tag}>{tag}</li>
            })}</ul>
            <button onClick={handlelike}>Likes {like}</button>
            
  
		</div>
	);
}

export default Questiondisplay;