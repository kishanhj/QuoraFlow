import React ,{useState,useEffect,useContext} from 'react';
import {BrowserRouter as Router , Route ,Link,Redirect} from 'react-router-dom';
import Axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form1 from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import bsCustomFileInput from 'bs-custom-file-input'
import Alert from 'react-bootstrap/Alert'
import { WithContext as ReactTags } from 'react-tag-input';
import { AuthContext } from '../firebase/Auth'
import { useForm } from 'react-hook-form'

const KeyCodes = {
	comma: 188,
	enter: 13,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter];


function EditForm(props) {
	const [issubmitting ,setissubmitting]=useState(false)
	const { currentUser } = useContext(AuthContext);
	const [ err, seterr ] = useState(false);
	const [isOwner ,setisOwner] =useState(undefined)
	const [ postData, setpostData]=useState(true);
    const [ getData, setgetData ] = useState({});
	const [image ,selectimage]=useState(null);
	const [oldimage,setoldimage]=useState(undefined);
	const [imagename, setimagename]=useState('');
	const [tags,settags]=useState([ ])
	const { register, errors, handleSubmit } = useForm();
	const [suggestions,setsuggestions]=useState([
	   { id: 'Computer Science', text: 'Computer Science' },
	   { id: 'Electronics', text: 'Electronics' },
	   { id: 'C++', text: 'C++' },
	   { id: 'Node', text: 'Node' },
	   { id: 'NodeJS', text: 'NodeJS' },
	   { id: 'Java', text: 'Java' }
	])
	const [oldtags,setoldtags]=useState([])
    useEffect(
        ()=>{
        console.log("question rendered")
        async function getdata(){
			try{
				const { data }= await Axios.get(`http://localhost:8080/questions/${props.match.params.id}`)
				setgetData(data)
				setoldimage(data.image)
				if(currentUser!==undefined && data.userid===currentUser.email){
					setisOwner({isowner:true})
				}
				else{
					setisOwner({isowner:false})
				}
				let edittags=[]
				let oldtags=[]
				for(let i=0;i<data.tags.length;i++){
					edittags.push({id:data.tags[i].tag,text:data.tags[i].tag})
					oldtags.push(data.tags[i].tag)
				} 
				
				settags(edittags)
				setoldtags(oldtags)
				if(data.image!==null){
					setimagename(data.image.split('/')[3])
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
        bsCustomFileInput.init()
        


    },[bsCustomFileInput.init()])
    
	const formSubmit = async (event) => {
		//disable form's default behavior
		
			
		try
		{
			setissubmitting(true)
			const formdata= new FormData()
			//get references to form fields.
			let question = document.getElementById('question').value;
			let description = document.getElementById('description').value;
			formdata.append("title",question)
			formdata.append("description",description)
			let tagtext=[]
			
			for (let i in tags){
				
				tagtext.push(tags[i].text)
			}
			
			formdata.append("tags",tagtext)
			
			if(image !==null){
				formdata.append("image",image)

			}
			else{
				formdata.append("image",oldimage)
			}
			for(let i of formdata.entries()){
				console.log(i[0]+" "+i[1])
			}
			

			const { data } = await Axios.patch(`http://localhost:8080/questions/${props.match.params.id}`, formdata, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': 'multipart/form-data',
				}
				
			});
			const tagdata={
				tagarray:tagtext,
				questionID:data._id

			}
			
			
			
			const { }= await Axios.delete(`http://localhost:8080/tags/removetags`,{ data: {
				tagarray:oldtags,
				questionID:data._id
			}})
			const { }=await Axios.post(`http://localhost:8080/tags/addtags`, tagdata)
			props.history.push(`/questions/display/${props.match.params.id}`)
		}
		catch(e){
			setissubmitting(false)
			seterr(true)
		}
		
		// document.getElementById('question').value = '';
		// document.getElementById('description').value = '';

		// props.history.push(`/questions/display/${data._id}`)
		
		
        
	};
	const handleimagechange=(e)=>{
		selectimage(e.target.files[0])
	}
	const handleDelete=(i)=>{
        const tag = tags;
		settags(tag.filter((t, index) => index !== i))
	}
	const handleAddition=(tag)=>{
		settags((prevState)=>{
            return[...prevState,tag]
        })
		
    }
    
    const handleTitle=(e)=>{
        const val=e.target.val
        setgetData((prevState)=>{
            return{...prevState,title:val}
        })

    }
    const handleDescription=(e)=>{
        const val=e.target.val
        setgetData((prevState)=>{
            return{...prevState,description:val}
        })

	}
	const handledeleteimage=(e)=>{
		setoldimage(null)
	}

	if (currentUser==undefined) {
			return <Redirect to='/signin'></Redirect>
	}

    if(postData===false){
        return(<Redirect to='/notfound'/>)
	}

	if(getData && getData.isdeleted===true){
        return (<Redirect to='/deleted'/>)

	}
	
	if(isOwner && isOwner.isowner===false){
        return(<Redirect to='/notfound'/>)
    }
	
	
	return (
		<div>
			<Form1 id='simple-form' onSubmit={handleSubmit(formSubmit)} encType="multipart/form-data">
				<Form1.Group>
    			<Form1.Label>Question</Form1.Label>
    			<Form1.Control id='question' name='question' type="text" value={getData && getData.title} onChange={handleTitle} placeholder="Question Title" ref={register({ required: true, maxLength: 2000,minLength:10 })} />
				{errors.question && <Alert variant={'danger'}>The Question field is required with a min of 10 characters and max of 2000 characters</Alert>}
  				</Form1.Group>
				<Form1.Group>
   				<Form1.Label>Description</Form1.Label>
    			<Form1.Control as="textarea" rows="3" id='description' name='description' value={getData && getData.description} onChange={ handleDescription}  placeholder="Add a description." ref={register({ required: true, maxLength: 20000,minLength:10 })} />
				{errors.description && <Alert variant={'danger'}>The Description field is required with a min of 10 characters and max of 20000 characters</Alert>}
  				</Form1.Group>
				<Form1.Label>Tags</Form1.Label>
				<ReactTags 
					inputFieldPosition="inline"
					tags={tags}
                    suggestions={suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
					delimiters={delimiters}

					 />
				{err?<Alert variant={'danger'}>There must be a minimum of 1 tag and maximum of 10 tags</Alert>:<p></p>}   
				<br/>
				<Form1.Label>Optional Image Upload</Form1.Label>
				<br/>
				{oldimage? <Button variant="outline-primary" onClick={handledeleteimage}>{imagename} X</Button>: null}
				
				<Form1.File id="image1" label="Optional Image Upload" onChange={handleimagechange}   accept="image/*" custom/>  
				<Button disabled={issubmitting} variant="primary" type="submit">
    				Submit
  				</Button>
			</Form1>
		</div>
		
	);
	
    
} 

export default EditForm;