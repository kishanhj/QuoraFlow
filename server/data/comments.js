const ObjectID = require('mongodb').ObjectID;
const getCommentsCollection = require('../config/mongoCollections').Comments;
const getQuestionsCollection = require('../config/mongoCollections').Questions;
const getUsersCollection = require('../config/mongoCollections').Users;

async function getComment(commentObjectId) {
    const commentsCollection = await getCommentsCollection();
    const comment = await commentsCollection.findOne({
        _id: commentObjectId
    });

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

    return comments;
}

async function addComment(parentId, userEmail, text, isParentQuestion) {
    const usersCollection = await getUsersCollection();
    const commentsCollection = await getCommentsCollection();

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
        throw new Error('User not found');
    }

    console.log(user);

    const comment = {
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
    }

    if (hadUpvoted) {
        updateVoteObj.$pull = { upVoteUsers: userId };
        updateVoteObj.$inc.upVotes = -1;
    } else {
        updateVoteObj.$pull = { downVoteUsers: userId };
        updateVoteObj.$inc.downVotes = -1;
    }

    console.log(updateVoteObj);

    const updateInfo = await commentsCollection.updateOne({ _id: ObjectID(commentId) }, updateVoteObj);

    if (updateInfo.matchedCount === 0) {
        throw new Error('Comment not found');
    }

    return true;
}

module.exports = {
    getCommentTree,
    addComment,
    addVote,
    removeComment,
    updateComment,
};
