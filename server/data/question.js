const mongocollection = require('../config/mongoCollections');
const ObjectID= require("mongodb").ObjectID
const questions = mongocollection.Questions
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config= require("../config/amazonsecretKeys")
const awskeys= config.awsconfig
const path =require("path")
const elasticSearchAPI = require("../elasticSearch/searchAPI");

// aws.config.update({
//     secretAccessKey:awskeys.AWS_SECRET_KEY_ID,
//     accessKeyId:awskeys.AWS_ACCESS_KEY_ID,
//     region:'us-east-1',
    
// })
aws.config.update({
    accessKeyId: awskeys.AWS_ACCESS_KEY_ID,
    secretAccessKey: awskeys.AWS_SECRET_KEY_ID,
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
    if(image!=undefined){
        if(typeof image !=='string') throw  "Invalid image path"
    }

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
        followers:[]

    }
    const questioncollection = await questions()
    const insertedquestion = await questioncollection.insertOne(newquestion);
    if(insertedquestion.insertedCount === 0) throw "the question could not be added";
    const newid= insertedquestion.insertedId;
    const questiondata=await getquestion(String(newid));
    elasticSearchAPI.addQuestion(questiondata);
    return questiondatal
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
        updateq.image=newquestion.image
    }
    
    if(newquestion.tags){
        if(!Array.isArray(newquestion.tags)) throw "tags is not of Array type"
        updateq.tags=newquestion.tags
    }
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
    const Deletedquestion = await questioncollection.updateOne({_id:ObjectID(id)},{$set:{isdeleted:true}})
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

module.exports={
    createquestion,
    getallquestions,
    getquestion,
    deletequestion,
    updatequestion,
    upload,
    updatelike

}