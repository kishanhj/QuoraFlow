import React, {useState,useEffect,useContext} from 'react';
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
import { AuthContext } from '../firebase/Auth'



function Questiondisplay(props) {
    const { currentUser } = useContext(AuthContext);	
    const [ getData, setgetData ] = useState({});
    const [hasliked ,sethasliked] = useState(false);
    const [isOwner, setisOwner]= useState(false)
    const [ gettags, settags]=useState(undefined);
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
                    settimestamp(new Date(data.timestamp).toUTCString())
                    setisOwner(data.userid==currentUser.email)
                    const likedata  = await Axios.get(`http://localhost:8080/questions/like/${props.match.params.id}/${currentUser.email}`)
                    sethasliked(likedata.data.like)
                    
                    
                
                
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
        
        


        },[props.match.params.id])
    
    const handlelike=(e)=>{
        async function addlike(){
            try{
                const { data }  = await Axios.patch(`http://localhost:8080/questions/like/${props.match.params.id}/${currentUser.email}`)
                setlike(data.likes.length)
                if(hasliked===true){
                    sethasliked(false)
                }
                else{
                    sethasliked(true)
                }
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
                {isOwner?<Nav variant="pills" >
                    <Nav.Item>
                        <Nav.Link href={`/questions/edit/${props.match.params.id}`}>Edit Question</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`/questions/delete/${props.match.params.id}`}>Delete Question</Nav.Link>
                    </Nav.Item>
                </Nav>:<p></p>}
                
                <Container>
                <Row><h1>{getData && getData.title}</h1></Row>
                <Row>  
                    <Col><p>{getData && getData.description}</p></Col>
                </Row>
                <Row>  
                    <Col><Image src={`${getData && getData.image}`} thumbnail/></Col>
                </Row>
                <Row>
                    <Col>{hasliked?<Button onClick={handlelike}>Unlike {like}</Button>:<Button onClick={handlelike}>like {like}</Button>}</Col>
                    <Col xs large="2"> <p className='TimeStamp grey-font'>{timestamp}</p></Col>
                    <Col><p className="Tag-header grey-font">Tags:</p>
                        <ul className="Tag-list">{gettags && gettags.map((tag)=>{
                            return <li  className="tag" key={tag.tag}><a href={`/tag/${tag._id}`}>{tag.tag}</a></li>
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

	return (
		<div className="App-body">
            {isOwner?<Nav variant="pills" >
                    <Nav.Item>
                        <Nav.Link href={`/questions/edit/${props.match.params.id}`}>Edit Question</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`/questions/delete/${props.match.params.id}`}>Delete Question</Nav.Link>
                    </Nav.Item>
                </Nav>:<p></p>}
            

            <Container>
                <Row><h1>{getData && getData.title}</h1></Row>
                <Row>  
                    <Col><p>{getData && getData.description}</p></Col>
                </Row>
                <Row>
                    <Col>{hasliked?<Button onClick={handlelike}>Unlike {like}</Button>:<Button onClick={handlelike}>like {like}</Button>}</Col>
                    <Col xs large="2"> <p className='TimeStamp grey-font'>{timestamp}</p></Col>
                    <Col><p className="Tag-header grey-font">Tags:</p>
                        <ul className="Tag-list">{gettags && gettags.map((tag)=>{
                            return <li  className="tag" key={tag.tag}><a href={`/tag/${tag._id}`}>{tag.tag}</a></li>
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
