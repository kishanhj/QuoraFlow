import React ,{useState,useEffect,useContext} from 'react';
import { Redirect } from 'react-router-dom'
import { Formik } from 'formik';
import axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import bsCustomFileInput from 'bs-custom-file-input'
import { WithContext as ReactTags } from 'react-tag-input';
import * as yup from 'yup';
import { AuthContext } from '../firebase/Auth'
import Remove from "./RemoveComponent"

const KeyCodes = {
	comma: 188,
	enter: 13,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const QuestionSchema = yup.object({
	question: yup.string().min(10).max(1000).required(),
	description: yup.string().min(10).max(10000).required()
  });

function QuestionForm(props) {
	const { currentUser } = useContext(AuthContext);
	const [ err, seterr ] = useState(false);
	const [errmsg ,seterrmsg]=useState(undefined)
	const [image ,selectimage]=useState(null)
	const [tags,settaags]=useState([
		{id:'General',text:'General'}
		
	 ])
	 const [suggestions,]=useState([
		{ id: 'Computer Science', text: 'Computer Science' },
		{ id: 'Electronics', text: 'Electronics' },
		{ id: 'C++', text: 'C++' },
		{ id: 'Node', text: 'Node' },
		{ id: 'NodeJS', text: 'NodeJS' },
		{ id: 'Java', text: 'Java' }
	 ])

	useEffect(
		()=>{
			console.log(currentUser)
			bsCustomFileInput.init()
		},[]
	)
	const formSubmit = async (event) => {
		//disable form's default behavior
		try{
			
			const formdata= new FormData()
			//get references to form fields.
			let question = document.getElementById('question').value;
			let description = document.getElementById('description').value;
			formdata.append("title",question)
			formdata.append("description",description)
			//provide input checking/validation
			//then perhaps post form data to an API or your express server end point
			let tagtext=[]
				for (let i in tags){
				
					tagtext.push(tags[i].text.toLowerCase())
				}

			
			
			formdata.append("tags",tagtext)
			
			let questioninfo = {
				title:question,
				description:description,
				tags:tags,
				image:image,
				userid:currentUser.email
			};
			formdata.append("userid",currentUser.email)
			if(image !==null){
				formdata.append("image",image)

			}
			
			
			for(let i of formdata.entries()){
				console.log(i[0]+" "+i[1])
			}
			let i = await currentUser.getIdToken()
			let api=process.env.REACT_APP_backendEndpoint + "questions";
			const { data } = await axios.post(api,formdata, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': 'multipart/form-data',
					'authtoken': i
				}
				
			});
			let tagapi=process.env.REACT_APP_backendEndpoint + "tags/addtags";
			await axios.patch(tagapi,
			{"tagarray":tagtext,"questionID":data._id},{
				headers: {
					'accept': 'application/json',
					'authtoken': i
				}
				
			})
	
			
			document.getElementById('question').value = '';
			document.getElementById('description').value = '';

			props.history.push(`/questions/display/${data._id}`)
		}
		catch(e){
			if (e.response) {
				
				seterr(true)
				seterrmsg({msg:e.response.data.error})
				console.log(e.response)
			} 

		}
	};

	const handleimagechange=(e)=>{
		selectimage(e.target.files[0])
	}
	const handleDelete=(i)=>{
		console.log(tags)
		console.log(i)
        const tag = tags;
		settaags(tag.filter((t, index) => index !== i))
	}
	const handleAddition=(tag)=>{
		settaags((prevState)=>{
            return[...prevState,tag]
        })
		
	}
	if (currentUser===undefined) {
        return <Redirect to='/signin'></Redirect>
    }
	
	return (
		<Formik
      validationSchema={QuestionSchema}
      onSubmit={formSubmit}
      initialValues={{
        question: '',
        description: '',
	  }}
	  validator={() => ({})}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
		errors,
		isSubmitting
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
			<Form.Group>
     			<Form.Label htmlFor="question">Question</Form.Label>
     			<Form.Control
                type="text"
                placeholder="Type your question here.."
				name="question"
				id='question'
                value={values.question}
                onChange={handleChange}
                isInvalid={!!errors.question}
              />

              <Form.Control.Feedback type="invalid">
                {errors.question}
              </Form.Control.Feedback>
  	 			</Form.Group>
	 			<Form.Group>
   	 			<Form.Label htmlFor="description">Description</Form.Label>
					<Form.Control
				as="textarea" 
				rows="3"
				onChange={handleChange}
				name="description"
				id="description"
                value={values.description}
				isInvalid={!!errors.description}
				placeholder="Add more details about your question here.."
              />
			  <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
     			
  	 			</Form.Group>
	 			<Form.Label>Tags(cannot have duplicate tags and no special characters):</Form.Label>
	 			<ReactTags 
	 				inputFieldPosition="inline"
	 				tags={tags}
                     suggestions={suggestions}
                     handleDelete={handleDelete}
                     handleAddition={handleAddition}
	 				delimiters={delimiters}
					 allowDeleteFromEmptyInput={false}
					 removeComponent={Remove}

	 				 /> 
				<p className="grey-font">Please press return after typing the tag</p>
				{err?<Alert variant={'danger'}>{errmsg && errmsg.msg}</Alert>:<p></p>} 
	 			<br/>
	 			<br/>
	 			<br/>
				 
	 			<Form.Label htmlFor="image1">Optional Image Upload</Form.Label>
	 			<Form.File id="image1" label="Click here to upload an image." onChange={handleimagechange} accept="image/*" custom/>  
	 			<Button variant="primary" type="submit" disabled={isSubmitting}>
     				{isSubmitting?"Submitting...":"Submit"}
  	 			</Button>
        </Form>
      )}
    </Formik>
	)
}

export default QuestionForm;