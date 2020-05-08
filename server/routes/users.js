const express = require("express")
const router = express.Router();
const data = require("../data");
const userData = data.users


router.post("/checkUserName", async (req, res) => {
    try {
        console.log("checkUser Called")
        let body = req.body;
        if (!body.userName) throw`Error: "userName not provided`
        if (typeof body.userName != 'string') throw `Error: "userName should be of type string`

        let status = await userData.checkUserName(body.userName);
        res.json({ flag: status })
    } catch (e) {
        res.send({ Error: e })
    }
})


//add user to the database
router.post("/addUser", async (req, res) => {


    try {
        console.log("addUser Called")
        let usr = req.body;
        if (!usr) throw `Error: "Request body not provided`
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type stirng`
        if (!usr.name) throw `Error: "name not provided`
        if (typeof usr.name != 'string') throw `Error: "name should be of type stirng`
        await userData.addUser(usr)
        res.send("good job")
    } catch (e) {
        res.json({ Error: e })
    }


});
//get user from email
router.post("/getUser", async (req, res) => {

    try {
        let usr = req.body;
        if (!usr) throw `Error: "Request body not provided`
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type stirng`

        let usrObj = await userData.getUser(usr.email);
        res.json(usrObj)
    } catch (e) {
        res.json({ Error: e })
    }

})

//get all users
router.get("/getAll", async (req, res) => {
    try {
        let usr = await userData.getAllUsers();
        res.json(usr)
    } catch (e) {
        res.json({ Error: e })
    }

})

router.post("/addQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.addQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})
router.post("/addCommentId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.comment_id) throw "comment_id not provided";
        let usr = await userData.addCommentId(body.email, body.comment_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

router.post("/removeQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.removeQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

router.post("/removeCommentId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.comment_id) throw "comment_id not provided";
        let usr = await userData.removeCommentId(body.email, body.comment_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

router.post("/addVotedCommentId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.comment_id) throw "comment_id not provided";
        let usr = await userData.addVotedCommentId(body.email, body.comment_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

router.post("/removeVotedCommentId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.comment_id) throw "comment_id not provided";
        let usr = await userData.removeVotedCommentId(body.email, body.comment_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})



router.post("/addFollowedQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.addFollowedQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})
router.post("/removeFollowedQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.removeFollowedQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})




module.exports = router;