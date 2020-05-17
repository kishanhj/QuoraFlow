import React, { useState, useContext } from "react";
import axios from "axios";
import settings from "../settings.json";
import "./Comment.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../firebase/Auth'

const ReplyBox = ({
    questionId,
    commentId,
    isParentQuestion = false,
    onReply,
    edit = false,
    text = '',
    onCancel,
}) => {
    const { currentUser } = useContext(AuthContext);
    const [input, setInput] = useState(text ? text : '');

    async function handleEdit() {
        const text = input.trim();
        if (text.length === 0) {
            return;
        }

        let api =
            settings.backendEndpoint + "questions/" + questionId + "/comments/" + commentId;

        const res = await axios.patch(api, {
            text
        }, {
            headers: {
                authtoken: await currentUser.getIdToken()
            }
        });

        if (res.data.ok) {
            setInput("");
            if (onReply) onReply();
        }
    }

    async function handleReply() {
        const text = input.trim();
        if (text.length === 0) {
            return;
        }

        let api =
            settings.backendEndpoint + "questions/" + questionId + "/comments";

        if (!isParentQuestion) {
            api += "/" + commentId;
        }

        if (!currentUser) {
            return;
        }

        const res = await axios.post(api, {
            text
        }, {
            headers: {
                authtoken: await currentUser.getIdToken()
            }
        });

        if (res.data.ok) {
            setInput("");
            if (onReply) onReply();
        }
    }

    const labelText = edit ? 'Edit' : (isParentQuestion ? 'Answer' : 'Reply');

    return (
        <div className="ReplyBox">
            <div>
                <label htmlFor="Comments">{labelText}</label>
                <textarea
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    id="Comments"
                ></textarea>
            </div>
            <div>
                <button
                    className="btn btn-primary btn-sm ReplyBox-btn"
                    onClick={edit ? handleEdit : handleReply}>
                        {edit ? 'Edit' : 'Reply'}
                </button>
                {onCancel &&
                <button
                    className="btn btn-link btn-sm ReplyBox-Cancel"
                    onClick={onCancel}>
                        Cancel
                </button>}
            </div>
        </div>
    );
};

export default ReplyBox;
