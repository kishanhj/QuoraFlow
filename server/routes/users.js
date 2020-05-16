const express = require("express")
const router = express.Router();
const data = require("../data");
const userData = data.users
const checkauth = require("./checkAuth")



/**
 * Checks if the user is an admin based on the email provided
 */
router.post("/isAdmin", async (req, res) => {
    try {
        let usr = req.body;
        if (!usr) {
            throw `Error: "Request body not provided`
        }
        if (!usr.email) throw `Error: "email address not provided`
        if (typeof usr.email != 'string') throw `Error: "email should be of type stirng`
        let status = await userData.adminCheck(usr.email);
        if (!status) {
            res.status(200).json({ flag: false });
        }
        else { 
            res.status(200).json({ flag: true });
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
router.post("/addUser", checkauth.checkAuth,async (req, res) => {


    try {
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/getUser", checkauth.checkAuth,async (req, res) => {

    try {
        if (req.locals.email !== req.body.email) { 
            throw "Error: Unauthorized Access"
        }
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
// router.get("/getAll", async (req, res) => {
//     try {
//         let usr = await userData.getAllUsers();
//         res.json(usr)
//     } catch (e) {
//         res.json({ Error: e })
//     }

// })

/**
 * Adds Liked question id to the given user
 */
router.post("/addLikedQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        if (req.locals.email !== req.body.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeLikedQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        if (req.locals.email !== req.body.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/addTagId", checkauth.checkAuth,async (req, res) => {


    try {
        
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeTagId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/addQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/addCommentId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeCommentId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/addVotedCommentId",checkauth.checkAuth ,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeVotedCommentId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/addFollowedQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
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
router.post("/removeFollowedQuestionId", checkauth.checkAuth,async (req, res) => {


    try {
        let body = req.body;
        if (!body.email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
        if (!body.question_id) throw "question_id not provided";
        let usr = await userData.removeFollowedQuestionId(body.email, body.question_id);
        res.json(usr);
    } catch (e) {
        console.log(e);
        res.json({ Error: e })
    }


})

router.get("/userInfo/:email", checkauth.checkAuth,async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
        let userInfo = await userData.getUserInfo(email);
        res.status(200).json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error });
    }
})

router.get("/userInfo/tags/:email",checkauth.checkAuth,async (req,res) => {
    try {
        const email = req.params.email;
        if (!email) throw "user email is not provided";
        if (req.body.email !== req.locals.email) {
            throw "Error: Unauthorized Access"
        }
        let userInfo = await userData.getUserTags(email);
        res.status(200).json(userInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({error : error});
    }
})




module.exports = router;