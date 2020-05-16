import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReplyBox from "./ReplyBox.jsx";
import settings from "../settings.json";
import "./Comment.css";
import { AuthContext } from '../firebase/Auth'
import moment from 'moment';

const UP_CODE = "\u25B2";
const DOWN_CODE = "\u25BC";
const BULLET_CODE = "\u2022";

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

const Comment = ({ questionId, comment, reply, refresh, votings, answerComment, child }) => {
    const { currentUser } = useContext(AuthContext);
    const [hidden, setHidden] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const currentUserId = currentUser.email;
    const childrenCount = countChildren(comment) + 1;
    const vote = votings[comment.id];

    async function handleVote(direction) {
        if (vote === direction) {
            direction = 'NONE';
        }

        const api = settings.backendEndpoint + "questions/" + questionId + "/comments/" + comment.id + "/vote";
        try {
            const res = await axios.post(api, { direction }, {
                headers: {
                    authtoken: await currentUser.getIdToken()
                }
            });
            const data = res.data;
            if (data.ok) {
                refresh();
            }
        } catch (e) {
            console.error("Failed to vote comment", e);
        }
    }

    async function removeComment() {
        const api = settings.backendEndpoint + "questions/" + questionId + "/comments/" + comment.id;
        try {
            const res = await axios.delete(api, {
                headers: {
                    authtoken: await currentUser.getIdToken()
                }
            })
            const data = res.data;
            if (data.ok) {
                refresh()
            }
        } catch (e) {
            console.error("Failed to remove comment", e);
        }
    }

    async function markCommentAsAnswer() {
        const api = settings.backendEndpoint + "questions/" + questionId + "/comments/" + comment.id + "/answer";
        try {
			const token = await currentUser.getIdToken();
            const res = await axios.post(api, null, {
                headers: {
                    authtoken: token
                }
            });
            const data = res.data;
            if (data.ok) {
                refresh()
            }
        } catch (e) {
            console.error("Failed to remove comment", e);
        }
    }

    comment.points = comment.upVotes - comment.downVotes;

    return (
        <div className="Comment">
            <div className="Comment-header">
                {!comment.isRemoved && (<>
                    <button className={"Comment-vote-btn " + (vote === 'UP' ? 'text-primary' : '')} onClick={() => handleVote("UP")}>
                        {UP_CODE}
                    </button>{" "}
                    <span className="Comment-points">{comment.points}</span>{" "}
                    <button className={"Comment-vote-btn " + (vote === 'DOWN' ? 'text-primary' : '')} onClick={() => handleVote("DOWN")}>
                        {DOWN_CODE}
                    </button>
                    <span className="Comment-user"> {comment.userName} </span>{" "}
                </>)}
                <span className="Comment-time"> {moment(comment.dateAdded).fromNow()} </span>{" "}
                <span className="Comment-hide" onClick={() => setHidden(!hidden)}>
                    [{hidden ? "+" + childrenCount : "-"}]
                </span>{" "}
                {comment.isAnswer && <span class="text-success">ANSWER</span>}
            </div>
            {!hidden && (
                <>
                    <div>
                        {isEditing ?
                        (<ReplyBox
                            questionId={questionId}
                            commentId={comment.id}
                            onReply={() => { setIsEditing(false); refresh() }}
                            edit={true}
                            text={comment.text}
                            onCancel={() => setIsEditing(false)}
                        />):
                        (<pre className={"Comment-content " + (comment.isRemoved ? 'Comment-deleted': '')}>{comment.text}</pre>)
                        }
                        <div className="Comment-footer">
                            {reply.replyParent === comment.id ? (
                                <ReplyBox
                                    questionId={questionId}
                                    commentId={comment.id}
                                    onReply={() => { reply.setReplyParent(null); refresh() }}
                                    onCancel={() => reply.setReplyParent(null)}
                                />
                            ) : (!comment.isRemoved && !isEditing &&
                                <>
                                    <button className="btn btn-link Comment-btn-link" onClick={() => reply.setReplyParent(comment.id)}>
                                        reply
                                    </button>
                                    {currentUserId === comment.userId &&
                                    <>
                                        {BULLET_CODE}
                                        <button className="btn btn-link Comment-btn-link"
                                                onClick={() => setIsEditing(true)}>
                                            edit
                                        </button>
                                        {BULLET_CODE}
                                        <button className="btn btn-link Comment-btn-link text-danger" onClick={() => removeComment()}>
                                            delete
                                        </button>
                                    </>}
                                    {!child && !answerComment && <>
                                        {BULLET_CODE}
                                        <button className="btn btn-link Comment-btn-link" onClick={() => markCommentAsAnswer()}>
                                            This is what I was looking for
                                        </button>
                                    </>}
                                </>
                            )}
                        </div>
                    </div>
                    {comment.comments &&
                        <CommentList
                            questionId={questionId}
                            comments={comment.comments}
                            reply={reply} refresh={refresh}
                            votings={votings}
                            answerComment={answerComment}
                            child={true}
                        />}
                </>
            )}
        </div>
    );
};

const CommentList = ({ questionId, comments, votings, reply, refresh, answerComment, child = false }) => {
    return (
        <div className="CommentList">
            {comments.map((c) => (
                <Comment
                    key={c.id}
                    questionId={questionId}
                    comment={c}
                    reply={reply}
                    refresh={refresh}
                    votings={votings}
                    answerComment={answerComment}
                    child={child}
                />
            ))}
        </div>
    );
};

const CommentBox = ({ questionId }) => {
    const [comments, setComments] = useState(null);
    const [votings, setVotings] = useState({});
    const [replyParent, setReplyParent] = useState(null);
    const [dirty, setDirty] = useState(0); // changing vlaue of 'dirty' refreshes commentbox
    const [answer, setAnswer] = useState(null);
    const { currentUser } = useContext(AuthContext);

    const refresh = () => setDirty(Math.random());

    useEffect(() => {
        async function fetchComments() {
            let api = settings.backendEndpoint + "questions/" + questionId + "/comments";
            const res = await axios.get(api, {
                headers: {
                    authtoken: await currentUser.getIdToken()
                }
            });
            const data = res.data;

            const answerComment = data.question.issolved;

            if (data.ok) {
                setComments(data.comments);
                setVotings(data.userVoting);
                setAnswer(answerComment ? answerComment.toString() : null);
            }
        }

        fetchComments();
    }, [questionId, dirty]);

    return (
        <>
            <ReplyBox questionId={questionId} isParentQuestion={true} onReply={() => refresh()} />
            {comments &&
                (comments.length === 0 ? (
                    <p>No comments</p>
                ) : (
                    <CommentList
                        questionId={questionId}
                        comments={comments.sort((a, b) => b.isAnswer ? 1 : (a.isAnswer ? -1 : 0))}
                        votings={votings}
                        reply={{ replyParent, setReplyParent }}
                        refresh={refresh}
                        answerComment={answer}
                        child={false}
                    ></CommentList>
                ))}
        </>
    );
};

export { Comment, CommentList, CommentBox };
