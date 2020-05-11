const express= require("express")
const router = express.Router();
const data = require("../data");
const ObjectID= require("mongodb").ObjectID
const tagsdataAPI= data.tags


router.post("/addtags",async function(req,res){
    try{
        const t=req.body
        if(!t) throw "No tag data"
        if(!t.tagarray) throw "No tag Array defined"
        if(!t.questionID) throw "No Question Id is defined"

        let tagsarray=t.tagarray.split(",")

        await tagsdataAPI.addtags(tagsarray,ObjectID(t.questionID))
        res.sendStatus(200)
        return;

    }
    catch(e){
        res.status(200).json({error:e})

    }
})

router.delete("/removetags",async function(req,res){
    try{
        const t=req.body
        if(!t) throw "No tag data"
        if(!t.tagarray) throw "No tag Array defined"
        if(!t.questionID) throw "No Question Id is defined"

        let tagsarray=t.tagarray.split(",")

        await tagsdataAPI.removetags(tagsarray,ObjectID(t.questionID))
        res.sendStatus(200)
        return;

    }
    catch(e){
        res.status(200).json({error:e})

    }
})

router.get("/main/:id", async (req,res) => {
    try{
        if(!req.params.id) throw "Must provide an ID";

        const tagsData = await tagsdataAPI.getAllTagsData(req.params.id);
        res.status(200).json(tagsData);
    }catch(err){
        console.log(err);
        res.status(400).json({"error":err});
    }
});

module.exports=router