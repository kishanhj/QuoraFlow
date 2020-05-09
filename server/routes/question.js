const express= require("express")
const router = express.Router();
const data = require("../data");
const questionData= data.questions
const userData =data.users;



router.get("/" ,async function(req,res){
    try{
        allNotdeletedquestions=[]
        const allQuestions= await questionData.getallquestions()
        allQuestions.map((question)=>{
            if(question.isdeleted===false){
                allNotdeletedquestions.push(question)
            }
        })
        res.status(200).json(allNotdeletedquestions)
        return;

    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }

})

router.get("/:id" ,async function(req,res){
    try{
        await questionData.getquestion(req.params.id)

    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        const question= await questionData.getquestion(req.params.id)
        if(question.isdeleted===false){
            res.status(200).json(question)
            return;

        }
        else{
            res.status(404).json({error:"Sorry, the question has been deleted"})
            return;
        }
        

    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }

})

router.post("/",questionData.upload.single('image'),async function(req,res){
    
    try{
        

        console.log(req.body)
        let image=undefined
        if(req.file){
            image=String(req.file.location)
        }
        const questiondata=req.body
        error=[]
        if(!questiondata){
            error.push("No Data Entered")
        }
        if(!questiondata.title){
            error.push("No Title Entered")
        }
        if(!questiondata.description){
            error.push("No Description Entered")
        }
        if(!questiondata.tags){
            error.push("No Tags Entered")
        }
        if(!questiondata.userid){
            error.push("No User Id Entered")
        }
        if(error.length>0){
            res.status(400).json({error:error})
            return;
        }
       
        
        
        
        tags=questiondata.tags.split(",")
       const postquestion= await questionData.createquestion(questiondata.title,questiondata.description,tags,questiondata.userid,image)
       console.log(postquestion)
       const addingTouser =await userData.addQuestionId(postquestion.userid,String(postquestion._id))
       
       res.status(200).json(postquestion)
       return;

    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }
})

router.patch("/:id",questionData.upload.single('image'),async function(req,res){
    const questiondata=req.body
    try{
        await questionData.getquestion(req.params.id)

    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        if(questiondata.title===undefined && questiondata.description===undefined && questiondata.image===undefined && questiondata.tags===undefined){
            throw "incorrect Update info"
        }
        
        if(req.file){
            questiondata.image=String(req.file.location)
        }
    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }
    try{
    
        questiondata.tags=questiondata.tags.split(",")
        const updatequestion= await questionData.updatequestion(req.params.id,questiondata)
        res.status(200).json(updatequestion)
        return;

    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }
})

router.delete("/:id",async function(req,res){
    try{
        
       const deletequestion= await questionData.deletequestion(req.params.id)
       res.sendStatus(200)
       return;

    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }
})

router.patch("/like/:id/:userid",async function(req,res){
    try{
        await questionData.getquestion(req.params.id)

    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        await userData.getUser(req.params.userid)
    }
    catch(e){
        console.log(1)
        res.status(404).json({error:e})
        return;
    }
    try{
        if(await questionData.getlike(req.params.id,req.params.userid)){
            const updatelike = await questionData.unlike(req.params.id ,req.params.userid)
            res.status(200).json(updatelike)
            return;
        }
        else{
            const updatelike = await questionData.updatelike(req.params.id ,req.params.userid)
            res.status(200).json(updatelike)
            return;

        }
        
    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }

})

router.delete("/like/:id/:userid",async function(req,res){
    try{
        await questionData.getquestion(req.params.id)

    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        await userData.getUser(req.params.userid)
    }
    catch(e){
        console.log(1)
        res.status(404).json({error:e})
        return;
    }
    try{
        const updatelike = await questionData.unlike(req.params.id ,req.params.userid)
        res.status(200).json(updatelike)
        return;
    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }

})

router.get("/like/:id/:userid",async function(req,res){
    try{
        await questionData.getquestion(req.params.id)

    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        await userData.getUser(req.params.userid)
    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        const glike = await questionData.getlike(req.params.id,req.params.userid)
        res.status(200).json({like:glike})
        return;
    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }

})

module.exports= router
