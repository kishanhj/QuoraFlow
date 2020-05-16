const express = require("express")
const router = express.Router();
const data = require("../data");
const ObjectID = require("mongodb").ObjectID
const tagsdataAPI = data.tags
const userData = data.users;
const questionData = data.questions
const checkauth= require("./checkAuth")


router.patch("/addtags",checkauth.checkAuth,async function (req, res) {
    try{
        if(req.body.questionID){
            const {userid}= await questionData.getquestion(req.body.questionID)
            if(userid!==req.locals.email) throw "UnAthorized Acess"
        }
    }
    catch(e){
        res.status(403).json({ Error: "Unauthorized Route" })
    }
    try {
        const t = req.body
        if (!t) throw "No tag data"
        console.log(t.tagarray)
        if (!t.tagarray) throw "No tag Array defined"
        if (!t.questionID) throw "No Question Id is defined"

        let tagsarray = t.tagarray.split(",")

        await tagsdataAPI.addtags(tagsarray, ObjectID(t.questionID))
        res.sendStatus(200)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })

    }
})

router.patch("/removetags",checkauth.checkAuth, async function (req, res) {
    try{
        if(req.body.questionID){

            const {userid}= await questionData.getquestion(req.body.questionID)
            if(userid!==req.locals.email && await userData.adminCheck(req.locals.email)===false) throw "UnAthorized Acess"
        }
    }
    catch(e){
        res.status(403).json({ Error: "Unauthorized Route" })
    }
    try {
        const t = req.body
        if (!t) throw "No tag data"
        if (!t.tagarray) throw "No tag Array defined"
        if (!t.questionID) throw "No Question Id is defined"

        let tagsarray = t.tagarray.split(",")

        await tagsdataAPI.removetags(tagsarray, ObjectID(t.questionID))
        res.sendStatus(200)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })

    }
})

router.get("/main/:id/:email", async (req, res) => {
    try {
        if (!req.params.id) throw "Must provide an ID";
        if (!req.params.email) throw "Must provide email";

        const tagsData = await tagsdataAPI.getAllTagsData(req.params.id, req.params.email);
        res.status(200).json(tagsData);
    } catch (err) {
        console.log(err);
        res.status(400).json({ "error": err });
    }
});

router.get("/followers/:id", async (req, res) => {
    try {
        if (!req.params.id) throw "Must provide an ID";
        const tagFollowers = await tagsdataAPI.getTagFollowers(req.params.id);
        res.status(200).json(tagFollowers);
    } catch (err) {
        console.log(err);
        res.status(400).json({ "error": err });
    }
});
router.get("/getalltags", async (req, res) => {
    try {
        const allTags = await tagsdataAPI.getAllTags();
        res.json(allTags)
    } catch (e) {
        res.json({Error:e})
    }
})

module.exports = router