const express = require("express")
const router = express.Router();
const data = require("../data");
const questionData = data.questions
const userData = data.users;
const tagData = data.tags;
const admin = require("firebase-admin")
const checkauth= require("./checkAuth")


router.get("/", async function (req, res) {
    try {
        allNotdeletedquestions = []
        const allQuestions = await questionData.getallquestions()
        allQuestions.map((question) => {
            if (question.isdeleted === false) {
                allNotdeletedquestions.push(question)
            }
        })
        res.status(200).json(allNotdeletedquestions)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})

router.get("/:id", async function (req, res) {
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        let tags = []
        const question = await questionData.getquestion(req.params.id)
        if (question.tags.length > 0) {
            for (let i = 0; i < question.tags.length; i++) {
                let tag = await tagData.getTagbyname(question.tags[i].toLowerCase())
                tags.push({ _id: tag._id, tag: question.tags[i] })
            }
        }
        question.tags = tags
        res.status(200).json(question)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})

router.post("/", checkauth.checkAuth, questionData.upload.single('image'), async function (req, res) {

    try {
        let image = undefined
        if (req.file) {
            image = String(req.file.location)
        }
        const questiondata = req.body
        error = []
        if (!questiondata) {
            error.push("No Data Entered")
        }
        if (!questiondata.title) {
            error.push("No Title Entered")
        }
        if (!questiondata.description) {
            error.push("No Description Entered")
        }
        if (!questiondata.tags) {
            error.push("No Tags Entered")
        }
        if (!req.locals.email) {
            error.push("No User Id Entered")
        }
        if (error.length > 0) {
            res.status(400).json({ error: error })
            return;
        }




        tags = questiondata.tags.split(",")
        const postquestion = await questionData.createquestion(questiondata.title, questiondata.description, tags,req.locals.email, image)
        const addingTouser = await userData.addQuestionId(postquestion.userid, String(postquestion._id))

        res.status(200).json(postquestion)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }
})


router.patch("/:id",checkauth.checkAuth, questionData.upload.single('image'), async function (req, res) {
    try{
        if(req.body.email!==req.locals.email){
            throw "UnAthorized Acess"
        }
    }
    catch(e){
        res.status(403).json({ Error: "Unauthorized Route" })
    }
    const questiondata = req.body
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        if (questiondata.title === undefined && questiondata.description === undefined && questiondata.image === undefined && questiondata.tags === undefined) {
            throw "incorrect Update info"
        }

        if (req.file) {
            questiondata.image = String(req.file.location)
        }
    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }
    try {
        questiondata.tags = questiondata.tags.split(",")
        const updatequestion = await questionData.updatequestion(req.params.id, questiondata)
        res.status(200).json(updatequestion)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }
})



router.delete("/:id",checkauth.checkAuth, async function (req, res) {
    
    try{

        const questiondata=await questionData.getquestion(req.params.id)
        if(questiondata.userid!==req.locals.email && await userData.adminCheck(req.locals.email)===false){
            throw "UnAthorized Acess"
        }
    }
    catch(e){
        res.status(403).json({ Error: "Unauthorized Route" })
        return;
    }
    try {
        const deletequestion = await questionData.deletequestion(req.params.id)
        res.sendStatus(200)
        return;

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }
})

router.patch("/like/:id",checkauth.checkAuth, async function (req, res) {
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        await userData.getUser(req.locals.email)
    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        if (await questionData.getlike(req.params.id, req.locals.email)) {
            const updatelike = await questionData.unlike(req.params.id, req.locals.email)
            const updateuser = await userData.removeLikedQuestionId(req.locals.email, req.params.id)
            res.status(200).json(updatelike)
            return;
        }
        else {
            const updatelike = await questionData.updatelike(req.params.id, req.locals.email)
            const updateuser = await userData.addLikedQuestionId(req.locals.email, req.params.id)
            res.status(200).json(updatelike)
            return;

        }

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})



router.get("/like/:id/:userid", async function (req, res) {
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        await userData.getUser(req.params.userid)
    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        const glike = await questionData.getlike(req.params.id, req.params.userid)
        res.status(200).json({ like: glike })
        return;
    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})


router.patch("/report/:id/",checkauth.checkAuth, async function (req, res) {
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        await userData.getUser(req.locals.email)
    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        if (await questionData.getreport(req.params.id,req.locals.email)) {
            const updatereport = await questionData.unreport(req.params.id,req.locals.email)
            res.status(200).json(updatereport)
            return;
        }
        else {
            const updatereport = await questionData.updatereport(req.params.id,req.locals.email)
            res.status(200).json(updatereport)
            return;

        }

    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})


router.get("/report/:id/:userid", async function (req, res) {
    try {
        await questionData.getquestion(req.params.id)

    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        await userData.getUser(req.params.userid)
    }
    catch (e) {
        res.status(404).json({ error: e })
        return;
    }
    try {
        const greport = await questionData.getreport(req.params.id, req.params.userid)
        res.status(200).json({ report: greport })
        return;
    }
    catch (e) {
        res.status(400).json({ error: e })
        return;
    }

})

module.exports = router
