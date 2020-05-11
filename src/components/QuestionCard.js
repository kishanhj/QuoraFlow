import React, { useState } from "react";
import { Link } from "react-router-dom";


const QuestionCard = (props) => {
    const [question,setQuestion] = useState(props.data);
    const {tags,userName} = question;

    const getQuestionLink = () => {
        return `/questions/display/${question._id}`;
    }

    const getAnswered = () => {
        if(null == question.issolved)
            return "No correct answers yet";
        return "Answered";
    }

    return (
        <div className="question_card">
            {/* //tags */}
            <div className="qc_tag_wrap">
                {tags && tags.map( (tag) => <div className='tag cap' key={tag}> {tag} </div>)}
            </div>
            {/* //user */}
            <div className='qc_user_wrap'>
                <img className='qc_user_img' src='/imgs/user.png'></img>
                <div className="">
                    <div className = "qc_wrap_title title">{userName}</div>
                    <div className = "qc_wrap_answered">{getAnswered()}</div>
                </div>
            </div>
            {/* //question */}
            <div className="qc_question_wrap">
            <div className = "qc_queston_title title"> 
                <Link to={getQuestionLink()}>{question.title}</Link> 
            </div>
            <div className = "qc_queston_desc "> {question.description} </div>
            </div>
        </div>
    )
}

export default QuestionCard; 