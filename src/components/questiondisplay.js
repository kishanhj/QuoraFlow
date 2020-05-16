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
import settings from "../settings.json";



function Questiondisplay(props) {
    const { currentUser } = useContext(AuthContext);	
    const [ getData, setgetData ] = useState({});
    const [hasliked ,sethasliked] = useState(false);
    const [hasreport ,sethasreport] = useState(false);
    const [isOwner, setisOwner]= useState(false)
    const [isAdmin, setisAdmin]= useState(false)
    const [ gettags, settags]=useState(undefined);
    const [ postData, setpostData]=useState(true);
    const [timestamp, settimestamp]=useState(undefined)
    const [like ,setlike]=useState(0)
    useEffect(
        ()=>{
       
            console.log("question rendered")
            async function getdata(){
                try{
                    let api=settings.backendEndpoint + "questions/"+props.match.params.id;
                    const { data }= await Axios.get(api)
                    if(currentUser){
                        let adminapi=settings.backendEndpoint + "users/isAdmin";
                        const admin= await Axios.post(adminapi, {email:currentUser.email});
                        console.log(admin.data.flag)
                        setisAdmin(admin.data.flag)
                    }
                    
                
                    setgetData(data)
                    settags(data.tags)
                    setlike(data.likes.length)
                    settimestamp(new Date(data.timestamp).toUTCString())
                    setisOwner(data.userid==currentUser.email)
                    let lapi=settings.backendEndpoint + "questions/like/"+props.match.params.id+"/"+currentUser.email;
                    const likedata  = await Axios.get(lapi)
                    sethasliked(likedata.data.like)
                    let rapi=settings.backendEndpoint + "questions/report/"+props.match.params.id+"/"+currentUser.email;
                    const reportdata  = await Axios.get(rapi)
                    sethasreport(reportdata.data.report)
                    
                    
                
                
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
                let i = await currentUser.getIdToken()
                let lapi=settings.backendEndpoint + "questions/like/"+props.match.params.id
                const { data }  = await Axios.patch(lapi,{},
                {headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': 'multipart/form-data',
                        'authtoken': i
                }})
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

    const handlereport=(e)=>{
        async function addlike(){
            try{
                let i = await currentUser.getIdToken()
                let rapi=settings.backendEndpoint + "questions/report/"+props.match.params.id
                const { data }  = await Axios.patch(rapi,{},
                {headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': 'multipart/form-data',
                        'authtoken': i
                }})
                if(hasreport===true){
                    sethasreport(false)
                }
                else{
                    sethasreport(true)
                }
            }
            catch(e){
                console.log("could not update report")
            }

        }
        addlike()
        

    }
    if (currentUser==undefined) {
        return (<Redirect to='/signin'></Redirect>)
    }


    if(postData===false){
        return(<Redirect to='/notfound'/>)
    }
    if(getData && getData.isdeleted===true){
        return (<Redirect to='/deleted'/>)

    }
   
   

        return (
            <div className="App=body">
                {isOwner?<Nav className="justify-content-end" variant="tabs" >
                    <Nav.Item>
                        <Nav.Link href={`/questions/edit/${props.match.params.id}`}><span id="edit-q">Edit Question</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link id="delete-question" href={`/questions/delete/${props.match.params.id}`}><span id="del-q">Delete Question</span></Nav.Link>
                    </Nav.Item>
                </Nav>:null}
                {isAdmin?<Button variant="warning"href={`/questions/delete/${props.match.params.id}`}>Delete Question</Button>:null}
                
                <Container>
                <Row><Col><h1>{getData && getData.title}</h1></Col><Col>{hasreport?<Button onClick={handlereport}>Unreport</Button>:<Button onClick={handlereport}>Report</Button>}</Col></Row>
                <Row>  
                    <Col><p>{getData && getData.description}</p></Col>
                </Row>
                {getData && getData.image ? <Row> <Col><Image alt="question-image" src={`${getData && getData.image}`} thumbnail/></Col></Row>:null }
                
                <Row>
                    <Col>{hasliked?<Button onClick={handlelike}>Unlike {like}</Button>:<Button onClick={handlelike}>Like {like}</Button>}</Col>
                    <Col> <p className='TimeStamp grey-font'>{timestamp}</p></Col>
                    <Col><p className="Tag-header grey-font">Tags:</p>
                        <ul className="Tag-list">{gettags && gettags.map((tag)=>{
                            return <li  className="tag" key={tag.tag}><a title="tags" className="tag-content" href={`/tag/${tag._id}`}>{tag.tag}</a></li>
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
