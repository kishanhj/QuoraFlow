const express = require("express")
const comments = require("../data/comments");
const questions = require("../data/question");
const {checkAuth} = require("./checkAuth");

const router = express.Router();

router.get('/:questionId/comments', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;

    const userEmail = req.locals.email;

    if (!userEmail || userEmail.length === 0) {
        res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
        return;
    }

    let commentsObj = null;
    let userVoting = null;
    try {
        commentsObj = await comments.getCommentTree(questionId);
        userVoting = await comments.getUserVotedComments(questionId, userEmail);
    } catch (e) {
        console.error(e);
    }

    if (!commentsObj || !userVoting) {
        res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
        return;
    }

    res.json({
        ok: true,
        comments: commentsObj.comments,
        question: commentsObj.question,
        userVoting,
    });
});

router.post('/:questionId/comments', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const { text } = req.body;
    const userId = req.locals.email;

    let success = null;
    try {
        success = await comments.addComment(questionId, questionId, userId, text, true);
    } catch (e) {
        console.error(e);
    }

    if (!success) {
        res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
        return;
    }

    res.json({
        ok: true,
    });
});

router.post('/:questionId/comments/:commentId', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const commentId = req.params.commentId;
    const { text } = req.body;
    const userId = req.locals.email;

    let success = null;
    try {
        success = await comments.addComment(questionId, commentId, userId, text, false);
    } catch (e) {
        console.error(e);
    }

    if (!success) {
        res.status(500).json({
            ok: false,
            error: 'Internal Server Error'
        });
        return;
    }

    res.json({
        ok: true,
    });
});

router.delete('/:questionId/comments/:commentId', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const commentId = req.params.commentId;

    const comment = await comments.getCommentShort(commentId);
    if (!comment || comment.questionId.toString() !== questionId) {
        res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
        return;
    }

    if (comment.userId !== req.locals.email) {
        res.status(403).json({
            ok: false,
            error: 'Unauthorized'
        });
        return;
    }

    // TODO: check if user is admin
    const wasRemovedByAdmin = false;

    let success = null;
    try {
        success = await comments.removeComment(commentId, wasRemovedByAdmin);
    } catch (e) {
        console.log('Failed to remove comment', e);
    }

    if (!success) {
        res.status(404).json({
            ok: false,
            error: 'Not Found',
        });
        return;
    }

    res.json({
        ok: true,
    })
});

router.patch('/:questionId/comments/:commentId', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const commentId = req.params.commentId;

    const comment = await comments.getCommentShort(commentId);
    if (!comment || comment.questionId.toString() !== questionId) {
        res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
        return;
    }

    if (comment.userId !== req.locals.email) {
        res.status(403).json({
            ok: false,
            error: 'Unauthorized'
        });
        return;
    }

    const { text } = req.body;

    if (!text || text === '') {
        res.status(400).json({
            ok: false,
            error: 'Bad Request',
        });
        return;
    }

    let success = null;
    try {
        success = await comments.updateComment(commentId, text);
    } catch (e) {
        // console.log('Failed to update comment');
    }

    if (!success) {
        res.status(404).json({
            ok: false,
            error: 'Not Found',
        });
        return;
    }

    res.json({
        ok: true,
    });
});

router.post('/:questionId/comments/:commentId/vote', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const commentId = req.params.commentId;
    const { direction } = req.body;
    const userId = req.locals.email;

    if (direction !== 'UP' && direction !== 'DOWN' && direction !== 'NONE') {
        res.status(400).json({
            ok: false,
            error: 'Bad Request',
        });
        return;
    }

    let success = null;
    try {
        success = await comments.addVote(commentId, userId, direction);
    } catch (e) {
        console.error(e);
    }

    if (!success) {
        res.status(404).json({
            ok: false,
            error: 'Not Found'
        });
        return;
    }

    res.json({
        ok: true,
    });
});

router.post('/:questionId/comments/:commentId/answer', checkAuth, async (req, res) => {
    const questionId = req.params.questionId;
    const commentId = req.params.commentId;

    const question = await questions.getquestion(questionId);
    if (question.issolved) {
        res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
        return;
    }
    if (question.userid !== req.locals.email) {
        res.status(403).json({
            ok: false,
            error: 'Unauthorized'
        });
        return;
    }

    let success = null;
    try {
        success = await comments.markCommentAsAnswer(questionId, commentId);
    } catch (e) {
        console.error(e);
    }

    if (!success) {
        res.status(404).json({
            ok: false,
            error: 'Not Found'
        });
        return;
    }

    res.json({
        ok: true
    });
});

module.exports = router;
