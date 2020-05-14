const mongocollection = require('../config/mongoCollections');
const ObjectID= require("mongodb").ObjectID
const questions = mongocollection.Questions
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path =require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const elasticSearchAPI = require("../elasticSearch/searchAPI");

// aws.config.update({
//     secretAccessKey:awskeys.AWS_SECRET_KEY_ID,
//     accessKeyId:awskeys.AWS_ACCESS_KEY_ID,
//     region:'us-east-1',
    
// })
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: 'us-east-1'
   });

const s3=new aws.S3();


const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'question-overflow-1',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: "TESTING_IMG"});
      },
      key: function (req, file, cb) {
        cb(null,file.originalname)
      }
    })
  })

const valid = (word,name) =>{
    if (word === undefined) throw "No "+name+" entered"
}

const getallquestions = async()=>{
    const questioncollection = await questions()
    const allquestions= await questioncollection.find({}).toArray()
    return allquestions

}

const getquestion = async(id)=>{
    if(!id) throw "No Id is supplied"
    if(typeof id !=="string") throw "id is not of correct type"
    const questioncollection = await questions()
    const questiondata = await questioncollection.findOne({_id:ObjectID(id)});
    if (!questiondata) throw "No Question with that id"
    return questiondata
}


const createquestion = async(title,description,tags,userid,image)=>{
    valid(title,"Title");
    valid(description,"Description")
    valid(tags,"Tags")
    valid(userid,"User ID")

    if(typeof title !== "string" || title.length === 0) throw "Invalid title entered"
    if(typeof description !== "string" || description.length === 0) throw "Invalid description entered"
    if( description.length === 0) throw "Invalid description entered"
    if(Array.isArray(tags) !== true) throw "Invalid Tags entered"
    if(tags.length>10 || tags.length<1 ) throw "There must be atleast 1 tag max of 10 tags"
    if(image!=undefined){
        if(typeof image !=='string') throw  "Invalid image path"
    }
    if (typeof userid!== "string") throw "Invalid userid entered"

    newquestion={
        title: title,
        description: description,
        userid:userid,
        tags:tags,
        comments:[],
        timestamp:new Date(),
        isdeleted:false,
        issolved:undefined,
        image:image,
        likes:[],
        report:[],
        followers:[],
        sync:1,
        report:[]

    }
    const questioncollection = await questions()
    const insertedquestion = await questioncollection.insertOne(newquestion);
    if(insertedquestion.insertedCount === 0) throw "the question could not be added";
    const newid= insertedquestion.insertedId;
    const questiondata=await getquestion(String(newid));
    elasticSearchAPI.addQuestion(questiondata);
    return questiondata
}

const updatequestion = async(id , newquestion)=>{
    const updateq={}
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    await getquestion(id)

    if(newquestion.title ===undefined && newquestion.description ===undefined && newquestion.image ===undefined) throw "Update info incorrect"

    if(newquestion.title){
        if(typeof newquestion.title !=="string") throw "Title is not of string type"
        updateq.title=newquestion.title
    }

    if(newquestion.description){
        if(typeof newquestion.description !=="string") throw "Description is not of string type"
        updateq.description=newquestion.description
    }
    if(newquestion.image){
        if(typeof newquestion.image !=="string") throw "Image is not of string type"
        if(newquestion.image==='null'){updateq.image=null}
        else{
            updateq.image=newquestion.image
        }
        
    }
    
    if(newquestion.tags){
        if(!Array.isArray(newquestion.tags)) throw "tags is not of Array type"
        if(newquestion.tags.length >10 || newquestion.tags.length <1 || newquestion.tags[0]==='') throw "There must be atleast 1 tag max of 10 tags"
        updateq.tags=newquestion.tags
    }

    updateq.sync=2
    const questioncollection = await questions()
    const updatedInfo = await questioncollection.updateOne({_id:ObjectID(id)},{$set:updateq})
    const updatedquestion =  await getquestion(String(id));
    elasticSearchAPI.updateQuestion(updatedquestion);
    return updatedquestion;
}
const deletequestion=async(id)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    await getquestion(id)
    const questioncollection = await questions()
    const Deletedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$set:{isdeleted:true,sync:3}})
    return;

}

const updatelike=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    await getquestion(id)
    const questioncollection = await questions() 
    const updatedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$addToSet:{likes:String(userid)}}) 
    return await getquestion(String(id))

}


const unlike=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    await getquestion(id)
    const questioncollection = await questions() 
    const updatedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$pull:{likes:String(userid)}}) 
    return await getquestion(String(id))

}

const updatereport=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    await getquestion(id)
    const questioncollection = await questions() 
    const updatedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$addToSet:{report:String(userid)}}) 
    return await getquestion(String(id))

}

const unreport=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    await getquestion(id)
    const questioncollection = await questions() 
    const updatedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$pull:{report:String(userid)}}) 
    return await getquestion(String(id))

}


const getlike=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    const question = await getquestion(id)
    if(question.likes.length>0){
        for(let i=0;i<question.likes.length;i++){
            if(userid == question.likes[i]){
                return true
            }
        }

    }
    return false
    
}


const getreport=async(id,userid)=>{
    if(!id) throw "No id is provided"
    if(typeof id !=="string") throw "id is not of correct type"
    if(!userid) throw "No user id is provided"
    if(typeof userid !=="string") throw "user id is not of correct type"
    const question = await getquestion(id)
    if(question.report.length>0){
        for(let i=0;i<question.report.length;i++){
            if(userid == question.report[i]){
                return true
            }
        }

    }
    return false
    
}

module.exports={
    createquestion,
    getallquestions,
    getquestion,
    deletequestion,
    updatequestion,
    upload,
    updatelike,
    getlike,
    unlike,
    updatereport,
    unreport,
    getreport

}