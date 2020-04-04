import React, { useState } from 'react';
import './Comment.css';

const countChildren = (comment) => {
    const sub = comment.comments;
    if (!sub || sub.length === 0) {
        return 0;
    }

    let count = 0;
    for (const c of sub) {
        count += countChildren(c) + 1;
    }

    return count;
};

const Comment = ({ comment }) => {
    const [ hidden, setHidden ] = useState(false);

    const childrenCount = countChildren(comment) + 1;

    return <div className="Comment">
        <div className="Comment-header">
            <span className="Comment-user">{comment.user}</span>&nbsp;&nbsp;
            <span className="Comment-points">{comment.points + " points"}</span>&nbsp;&nbsp;
            <span className="Comment-time">{comment.time}</span>&nbsp;&nbsp;
            <span className="Comment-hide" onClick={() => setHidden(!hidden)}>
                [{hidden ? ("+" + childrenCount) : "-"}]
            </span>
        </div>
        {!hidden &&
            <div>
                <div className="Comment-content">{comment.content}</div>
                <div className="Comment-footer">
                    <button className="Comment-reply-btn">reply</button>
                </div>
            </div>
        }
        {!hidden && comment.comments && <CommentList comments={comment.comments}></CommentList>}
    </div>
};

const CommentList = ({ comments }) => {
    return <div className="CommentList">
        {comments.map(c => <Comment key={c.id} comment={c} ></Comment>)}
    </div>
};

export {
    Comment,
    CommentList
};
