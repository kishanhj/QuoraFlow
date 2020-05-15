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
}) => {
    const [input, setInput] = useState("");

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
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <button className="btn btn-primary btn-sm" onClick={handleReply}>Reply</button>
        </div>
    );
};

export default ReplyBox;
