const express = require("express")
const router = express.Router();
const data = require("../data");
const userData = data.users


/**
 * Checks if the user is an admin based on the email provided
 */
router.post("/isAdmin", async (req, res) => {
    try {
        let usr = req.body;
        if (!usr) throw `Error: "Request body not provided`
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type stirng`
        let status = await userData.adminCheck(usr.email);
        if (!status) {
            res.json({ flag: false });
        }
        else { 
            res.json({ flag: true });
        }


    } catch (e) {
        res.json({ Error: e })
    }
})

/**
 * checks if user exists in the database
 */
router.post("/checkuser", async (req, res) => {
    try {

        let usr = req.body;
        if (!usr) throw `Error: "Request body not provided`
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type stirng`

        let status = await userData.checkUser(usr.email)
        if (!status) res.json({ flag: false })
        else res.json({ flag: true })

    } catch (e) {
        res.json({ Error: e })
    }

})





/**
 * Checks if the user name provided is unique or not
 */
router.post("/checkUserName", async (req, res) => {
    try {
        console.log("checkUser Called")
        let body = req.body;
        if (!body.userName) throw `Error: "userName not provided`
        if (typeof body.userName != 'string') throw `Error: "userName should be of type string`

        let status = await userData.checkUserName(body.userName.toLowerCase());
        res.json({ flag: status })
    } catch (e) {
        res.send({ Error: e })
    }
})


/**
 * Adds new user to the database with given object
 */
router.post("/addUser", async (req, res) => {


    try {
        console.log("addUser Called")
        let usr = req.body;
        if (!usr) throw `Error: "Request body not provided`
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type string`
        if (!usr.name) throw `Error: "name not provided`
        if (typeof usr.name != 'string') throw `Error: "name should be of type string`
        let status = await userData.addUser(usr);
        if (status) {
            res.json(status)
        } else {
            throw `Error: user not inserted to database`
        }
    } catch (e) {
        res.json({ Error: e })
    }


});

/**
 * Get user object based on the email provided
 */
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

/**
 * Get array of all available users
 */
router.get("/getAll", async (req, res) => {
    try {
        let usr = await userData.getAllUsers();
        res.json(usr)
    } catch (e) {
        res.json({ Error: e })
    }

})

/**
 * Adds Liked question id to the given user
 */
router.post("/addLikedQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.addLikedQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

/**
 * Removed liked question id from the user
 */
router.post("/removeLikedQuestionId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.removeLikedQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

/**
 * Adds tag id to the given user
 */
router.post("/addTagId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.tag_id) throw "tag_id not provided";
        let usr = await userData.addTag(body.email, body.tag_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

/**
 * Removes tag id to the given user
 */
router.post("/removeTagId", async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (!body.tag_id) throw "tag_id not provided";
        let usr = await userData.removeTag(body.email, body.tag_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

/**
 * Adds question id to the gven user
 */
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
/**
 * Adds comment id to the gven user
 */
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

/**
 * Removes question id from the gven user
 */
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

/**
 * Removes comment id from the user
 */
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

/**
 * Adds voted comment id to the given user
 */
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

/**
 * Removes voted comment id from the given user
 */
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


/**
 * Adds followed question id to the given
 */
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

/**
 * Removes followed question id to the given
 */
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

router.get("/userInfo/:email", async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) throw "user email is not provided";
        let userInfo = await userData.getUserInfo(email);
        res.status(200).json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error });
    }
})

router.get("/userInfo/tags/:email",async (req,res) => {
    try {
        const email = req.params.email;
        if (!email) throw "user email is not provided";
        let userInfo = await userData.getUserTags(email);
        res.status(200).json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({error : error});
    }
})




module.exports = router;