import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router , Route ,Link,Redirect} from 'react-router-dom';
import Axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CommentBox } from './Comment'


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
                <Container>
                <Row><h1>{getData && getData.title}</h1></Row>
                <Row>  
                    <Col><p>{getData && getData.description}</p></Col>
                </Row>
                <Row>  
                    <Col><Image src={`${getData && getData.image}`} thumbnail/></Col>
                </Row>
                <Row>
                    <Col><Button onClick={handlelike}>Likes {like}</Button></Col>
                    <Col xs large="2"> <p>{timestamp}</p></Col>
                    <Col md="auto"><span className="title">Tags:</span></Col>
                    <Col md="auto">
                        
                        <ul>{gettags && gettags.map((tag)=>{
                            return <li  className="tag" key={tag}>{tag}</li>
                        })}</ul>
                    </Col>
                </Row>
            </Container>

                
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
            

            <Container>
                <Row><h1>{getData && getData.title}</h1></Row>
                <Row>  
                    <Col><p>{getData && getData.description}</p></Col>
                </Row>
                <Row>
                    <Col><Button onClick={handlelike}>Likes {like}</Button></Col>
                    <Col xs large="2"> <p>{timestamp}</p></Col>
                    <Col md="auto"><span className="title">Tags:</span></Col>
                    <Col md="auto">
                        
                        <ul>{gettags && gettags.map((tag)=>{
                            return <li  className="tag" key={tag}>{tag}</li>
                        })}</ul>
                    </Col>
                </Row>
                <Row>
                    <CommentBox questionId={props.match.params.id} />
                </Row>
            </Container>
            
  
		</div>
	);
}

export default Questiondisplay;
