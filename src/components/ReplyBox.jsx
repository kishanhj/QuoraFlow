import React, { useState } from "react";
import axios from "axios";
import settings from "../settings.json";
import "./Comment.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const ReplyBox = ({
    questionId,
    commentId,
    isParentQuestion = false,
    onReply,
    edit = false,
    text = '',
    onCancel,
}) => {
    const [input, setInput] = useState(text ? text : '');

    async function handleEdit() {
        let api =
            settings.backendEndpoint + "questions/" + questionId + "/comments/" + commentId;

        const res = await axios.patch(api, {
            text: input,
        });

        if (res.data.ok) {
            setInput("");
            if (onReply) onReply();
        }
    }

    async function handleReply() {
        let api =
            settings.backendEndpoint + "questions/" + questionId + "/comments";

        if (!isParentQuestion) {
            api += "/" + commentId;
        }

        const res = await axios.post(api, {
            userId: "5ea947287a55ecdb578d9237",
            text: input,
        });

        if (res.data.ok) {
            setInput("");
            if (onReply) onReply();
        }
    }

    return (
        <div className="ReplyBox">
            <div>
                <textarea
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
                    className="btn btn-link btn-sm"
                    onClick={onCancel}>
                        Cancel
                </button>}
            </div>
        </div>
    );
};

export default ReplyBox;
