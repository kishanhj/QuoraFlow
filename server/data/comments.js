const ObjectID = require('mongodb').ObjectID;
const getCommentsCollection = require('../config/mongoCollections').Comments;
const getQuestionsCollection = require('../config/mongoCollections').Questions;

async function getComment(commentObjectId) {
    const commentsCollection = await getCommentsCollection();
    const comment = await commentsCollection.findOne({
        _id: commentObjectId
    });

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

async function addComment(parentId, userId, text, isParentQuestion) {
    const commentsCollection = await getCommentsCollection();

    const comment = {
        userId: userId,
        text,
        upVotes: 0,
        downVotes: 0,
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

// TODO: User
// direction is 'UP' or 'DOWN'
async function addVote(commentId, userId, direction) {
    const commentsCollection = await getCommentsCollection();

    const voteObj = direction === 'UP' ? {
        upVotes: 1
    } : {
        downVotes: 1
    };

    const updateInfo = await commentsCollection.updateOne({
        _id: ObjectID(commentId)
    }, {
        $inc: voteObj
    });

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
