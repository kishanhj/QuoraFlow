const express= require("express")
const router = express.Router();
const data = require("../data");
const ObjectID= require("mongodb").ObjectID
const tagsdata= data.tags


router.post("/addtags",async function(req,res){
    try{
        const t=req.body
        if(!t) throw "No tag data"
        if(!t.tagarray) throw "No tag Array defined"
        if(!t.questionID) throw "No Question Id is defined"

        let tagsarray=t.tagarray.split(",")

        await tagsdata.addtags(tagsarray,ObjectID(t.questionID))
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

        await tagsdata.removetags(tagsarray,ObjectID(t.questionID))
        res.sendStatus(200)
        return;

    }
    catch(e){
        res.status(200).json({error:e})

    }
})

module.exports=router