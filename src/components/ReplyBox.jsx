import React, { useState } from "react";
import "./Comment.css";

const ReplyBox = ({ parentId, isParentQuestion = false, onReply }) => {
    const [input, setInput] = useState("");

    function handleReply() {
        setInput("");
        if (onReply) onReply();
    }

    return (
        <>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <button onClick={handleReply}>Reply</button>
        </>
    );
};

export default ReplyBox;
