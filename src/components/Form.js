import React ,{useState,useEffect} from 'react';
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
	const [ postData, setPostData ] = useState({});
	const [image ,selectimage]=useState(null)
	const [formsubmit,setformsubmit]=useState(false)
	const [tags,settaags]=useState([
		{id:'General',text:'General'}
		
	 ])
	 const [suggestions,setsuggestions]=useState([
		{ id: 'Computer Science', text: 'Computer Science' },
		{ id: 'Electronics', text: 'Electronics' },
		{ id: 'C++', text: 'C++' },
		{ id: 'Node', text: 'Node' },
		{ id: 'NodeJS', text: 'NodeJS' },
		{ id: 'Java', text: 'Java' }
	 ])

	useEffect(
		()=>{
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
			if(tags.length==0){
				tagtext.push("General")
			}
			else{
				for (let i in tags){
				
					tagtext.push(tags[i].text)
				}

			}
			
			formdata.append("tags",tagtext)
			
			let questioninfo = {
				title:question,
				description:description,
				tags:tags,
				image:image,
				userid:"2g3bfy46346"
			};
			formdata.append("userid","2g3bfy46346")
			if(image !==null){
				formdata.append("image",image)

			}
			
			
			for(let i of formdata.entries()){
				console.log(i[0]+" "+i[1])
			}

			const { data } = await axios.post('http://localhost:8080/questions', formdata, {
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
			const { }=await axios.post(`http://localhost:8080/tags/addtags`, tagdata)
	
			
			document.getElementById('question').value = '';
			document.getElementById('description').value = '';

			props.history.push(`/questions/display/${data._id}`)
		}
		catch(e){
			console.log(e)

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
	
	// return (
	// 	<div>
	// 		<Form1 id='simple-form' onSubmit={formSubmit} encType="multipart/form-data">
	// 			<Form1.Group>
    // 			<Form1.Label>Question</Form1.Label>
    // 			<Form1.Control required id='question' name='question' type="text" placeholder="Question Title"  />
  	// 			</Form1.Group>
	// 			<Form1.Group>
   	// 			<Form1.Label>Description</Form1.Label>
    // 			<Form1.Control required as="textarea" rows="3" id='description' name='description' placeholder="Add a description."/>
  	// 			</Form1.Group>
	// 			<Form1.Label>Tags</Form1.Label>
	// 			<ReactTags 
	// 				inputFieldPosition="inline"
	// 				tags={tags}
    //                 suggestions={suggestions}
    //                 handleDelete={handleDelete}
    //                 handleAddition={handleAddition}
	// 				delimiters={delimiters}
	// 				allowDeleteFromEmptyInput={false}

	// 				 />  
	// 			<br/>
	// 			<br/>
	// 			<br/>
	// 			<Form1.Label>Optional Image Upload</Form1.Label>
	// 			<Form1.File id="image1" label="Optional Image Upload" onChange={handleimagechange} accept="image/*" custom/>  
	// 			<Button variant="primary" type="submit">
    // 				Submit
  	// 			</Button>
	// 		</Form1>
              

	// 	</div>
	// );
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
     			<Form.Label>Question</Form.Label>
     			<Form.Control
                type="text"
                placeholder="question"
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
   	 			<Form.Label>Description</Form.Label>
					<Form.Control
				as="textarea" 
				rows="3"
				onChange={handleChange}
				name="description"
				id="description"
                value={values.description}
                isInvalid={!!errors.description}
              />
			  <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
     			
  	 			</Form.Group>
	 			<Form.Label>Tags</Form.Label>
	 			<ReactTags 
	 				inputFieldPosition="inline"
	 				tags={tags}
                     suggestions={suggestions}
                     handleDelete={handleDelete}
                     handleAddition={handleAddition}
	 				delimiters={delimiters}
	 				allowDeleteFromEmptyInput={false}

	 				 />  
	 			<br/>
	 			<br/>
	 			<br/>
	 			<Form.Label>Optional Image Upload</Form.Label>
	 			<Form.File id="image1" label="Optional Image Upload" onChange={handleimagechange} accept="image/*" custom/>  
	 			<Button variant="primary" type="submit" disabled={isSubmitting}>
     				Submit
  	 			</Button>
        </Form>
      )}
    </Formik>
	)
}

export default QuestionForm;