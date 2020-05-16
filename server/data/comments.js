const ObjectID = require('mongodb').ObjectID;
const getCommentsCollection = require('../config/mongoCollections').Comments;
const getQuestionsCollection = require('../config/mongoCollections').Questions;
const getUsersCollection = require('../config/mongoCollections').Users;

async function getCommentShort(commentId) {
    const commentsCollection = await getCommentsCollection();

    const comment = await commentsCollection.findOne({
        _id: ObjectID(commentId)
    });

    return comment;
}

async function getComment(commentObjectId) {
    const commentsCollection = await getCommentsCollection();
    const comment = await commentsCollection.findOne({
        _id: commentObjectId
    }, { projection: { upVoteUsers: 0, downVoteUsers: 0 } });

    if (comment.isRemoved) {
        delete comment.userId;
        delete comment.upVotes;
        delete comment.downVotes;
    }

    comment.id = comment._id;
    delete comment._id;
    for (let i = 0; i < comment.comments.length; ++i) {
        comment.comments[i] = await getComment(comment.comments[i]);
    }

    return comment;
}

async function getCommentTree(questionId) {
    if (!questionId) {
        throw new Error('Illegal argument questionId');
    }

    const questionsCollection = await getQuestionsCollection();
    const commentsCollection = await getCommentsCollection();

    const question = await questionsCollection.findOne({
        _id: ObjectID(questionId)
    });

    const comments = [];
    for (let i = 0; i < question.comments.length; ++i) {
        comments.push(await getComment(question.comments[i]));
    }

    return {question,comments};
}

async function getUserVotedComments(questionId, userEmail) {
    const commentsCollection = await getCommentsCollection();
    
    const upVotedComments = await commentsCollection.find({
        questionId: ObjectID(questionId),
        upVoteUsers: { $elemMatch: { $eq: userEmail } },
        isRemoved: false,
    }).project({ _id: 1 }).toArray();

    const downVotedComments = await commentsCollection.find({
        questionId: ObjectID(questionId),
        downVoteUsers: { $elemMatch: { $eq: userEmail } },
        isRemoved: false,
    }).project({ _id: 1 }).toArray();

    const map = {};
    for (let c of upVotedComments) {
        map[c._id] = 'UP';
    }
    for (let c of downVotedComments) {
        map[c._id] = 'DOWN';
    }

    return map;
}

/**
 * 
 * @param {string} questionId id of the question
 * @param {string} parentId id of parent (question or comment). If not a sub comment, questionId == parentId
 * @param {string} userEmail email of user (used as uesrId)
 * @param {string} text content of comment
 * @param {string} isParentQuestion true if parent is question, false if comment (redundant but still used)
 */
async function addComment(questionId, parentId, userEmail, text, isParentQuestion) {
    const usersCollection = await getUsersCollection();
    const commentsCollection = await getCommentsCollection();

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
        throw new Error('User not found');
    }

    const comment = {
        questionId: ObjectID(questionId),
        userId: userEmail,
        userName: user.userName,
        text,
        upVotes: 0,
        downVotes: 0,
        upVoteUsers: [],
        downVoteUsers: [],
        dateAdded: new Date(),
        comments: [],
        isRemoved: false,
    }
    const insertInfo = await commentsCollection.insertOne(comment);

    if (insertInfo.insertedCount === 0) {
        throw new Error('Failed to insert comment');
    }

    let parentCollection = !isParentQuestion ? commentsCollection :
        await getQuestionsCollection();

    const updateInfo = await parentCollection.updateOne({
        _id: ObjectID(parentId)
    }, {
        $push: {
            comments: insertInfo.insertedId
        }
    });

    if (updateInfo.matchedCount === 0) {
        throw new Error('Failed to add comment');
    }

    return true;
}

/**
 * @param wasRemoved: true if removed by mod, as opposed to deletion by user
 */
async function removeComment(commentId, wasRemoved) {
    const commentsCollection = await getCommentsCollection();
    const comment = await commentsCollection.findOne({
        _id: ObjectID(commentId)
    });

    if (!comment) {
        throw new Error('Comment not found');
    }

    const updateInfo = await commentsCollection.updateOne({
        _id: ObjectID(commentId)
    }, {
        $set: {
            text: wasRemoved ? '[removed]' : '[deleted]',
            isRemoved: true,
        }
    });

    if (updateInfo.matchedCount === 0) {
        throw new Error('Failed to add comment');
    }

    return true;
}

async function updateComment(commentId, text) {
    const commentsCollection = await getCommentsCollection();

    const updateInfo = await commentsCollection.updateOne({
        _id: ObjectID(commentId),
        isRemoved: {
            $ne: true
        }
    }, {
        $set: {
            text
        }
    });

     if (updateInfo.matchedCount === 0) {
        throw new Error('Failed to update comment');
    }

    return true;
}

// direction is 'UP', 'DOWN' or 'NONE'
async function addVote(commentId, userId, direction) {
    if (direction !== 'UP' && direction !== 'DOWN' && direction !== 'NONE') {
        throw new Error('Invalid Argument');
    }

    const commentsCollection = await getCommentsCollection();

    const comment = await commentsCollection.findOne({
        _id: ObjectID(commentId)
    });

    if (!comment) {
        throw new Error('Comment not found');
    }

    const hadUpvoted = comment.upVoteUsers.findIndex(u => u === userId) !== -1;
    const hadDownvoted = comment.downVoteUsers.findIndex(u => u === userId) !== -1;

    if ((direction === 'UP' && hadUpvoted) ||
        (direction === 'DOWN' && hadDownvoted)) {
        return true;
    }

    let updateVoteObj = {};

    if (direction === 'UP') {
        updateVoteObj.$addToSet = { upVoteUsers: userId };
        updateVoteObj.$inc = { upVotes: 1 };
    } else if (direction === 'DOWN') {
        updateVoteObj.$addToSet = { downVoteUsers: userId };
        updateVoteObj.$inc = { downVotes: 1 };
    } else {
        updateVoteObj.$inc = {};
    }

    if (hadUpvoted) {
        updateVoteObj.$pull = { upVoteUsers: userId };
        updateVoteObj.$inc.upVotes = -1;
    } else if (hadDownvoted) {
        updateVoteObj.$pull = { downVoteUsers: userId };
        updateVoteObj.$inc.downVotes = -1;
    }

    const updateInfo = await commentsCollection.updateOne({ _id: ObjectID(commentId) }, updateVoteObj);

    if (updateInfo.matchedCount === 0) {
        throw new Error('Comment not found');
    }

    return true;
}

async function markCommentAsAnswer(questionId, commentId) {
    const questionsCollection = await getQuestionsCollection();
    const commentsCollection = await getCommentsCollection();

    const comment = await commentsCollection.findOne({ _id: ObjectID(commentId) });
    if (!comment || comment.isRemoved || comment.questionId.toString() !== questionId) {
        throw new Error('Comment Not Found');
    }

    const updateInfo = await questionsCollection.updateOne({ _id: ObjectID(questionId) },{
        $set: {
            issolved: ObjectID(commentId)
        }
    });

    if (updateInfo.matchedCount === 0) {
        throw new Error('Question Not Found');
    }

    const commentUpdateInfo = await commentsCollection.updateOne({ _id: ObjectID(commentId) },{
        $set: {
            isAnswer: true
        }
    });

    if (commentUpdateInfo.matchedCount === 0) {
        throw new Error('Question Not Found');
    }

    return true;
}

module.exports = {
    getCommentShort,
    getCommentTree,
    addComment,
    addVote,
    removeComment,
    updateComment,
    getUserVotedComments,
    markCommentAsAnswer,
};
