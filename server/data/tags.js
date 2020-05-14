const mongocollection = require('../config/mongoCollections');
const ObjectID= require("mongodb").ObjectID
const tags = mongocollection.Tags
const elasticSearchApi = require("../elasticSearch/searchAPI");
const questionsDataAPI = require("./question");


const addtags=async(tagarray ,questionid)=>{

    if(!tagarray) throw "No tags has been defined"
    if(!questionid) throw "No Question id has been defined"
    if(!Array.isArray(tagarray)) throw "Tags not of array type"
    if(typeof(questionid)===ObjectID) throw "Question id not of ObjectId type"
    tagarray=tagarray.map(x => x.toLowerCase())
    const tagcollection = await tags()
    for (let i=0;i<tagarray.length;i++){
        const info = await tagcollection.updateOne({tag:tagarray[i]},{$addToSet:{questionid:questionid},$set:{sync:1}},{upsert:true});
        if(null != info.upsertedId){
            console.log("in elas",info.upsertedId._id,tagarray[i]);
            elasticSearchApi.addTag(info.upsertedId._id,tagarray[i]);
        }
    }
    return;


}

const removetags=async(tagarray ,questionid)=>{

    if(!tagarray) throw "No tags has been defined"
    if(!questionid) throw "No Question id has been defined"
    if(!Array.isArray(tagarray)) throw "Tags not of array type"
    if(typeof(questionid)===ObjectID) throw "Question id not of ObjectId type"
    tagarray=tagarray.map(x => x.toLowerCase())
    const tagcollection = await tags()
    for (let i=0;i<tagarray.length;i++){
        await tagcollection.update({tag:tagarray[i]},{ $pull: { questionid: questionid } })

    }
    return;


}

const getAllTagsData = async (id,email) => {
    
    if(!id) throw "Must provide an Id";
    if(typeof id !=="string") throw "id is not of correct type"
    if(!email) throw "Must provide an Id";
    if(typeof email !=="string") throw "email is not of correct type"

    const tagcollection = await tags();
    const tag = await tagcollection.findOne({_id:ObjectID(id)});
    const usersCollection = mongocollection.Users;
    const usersDB = await usersCollection();

    const questions = [];
    for(var qid of tag.questionid){
        var question = undefined;

        try {
            question = await questionsDataAPI.getquestion(qid.toString());
            question.userName = await usersDB.find({email : question.userid}).project({userName:1,_id:0}).toArray();
            question.userName = question.userName[0].userName;
        }catch(err){
            console.log(err);
            continue;
        }
        
        if(question) questions.push(question);
    }

    const followers = await usersDB.find({ tags : { $elemMatch : {$eq : id } }}).project({userName:1,_id:0}).toArray();
    const userTagIDs = await usersDB.find({email : email}).project({tags:1,_id:0}).toArray();

    const userTags = [];
    for(var tagID of userTagIDs[0].tags){
        var tagData = undefined;
        try {
            tagData = await tagcollection.findOne({_id:ObjectID(tagID)},{tag:1,_id:1});
        } catch (error) {
            console.log(error);
            continue;
        }

        if(!tagData) continue;
        userTags.push(tagData);
    }

    const data = {
        "id" : id,
        "title" : tag.tag,
        "questions" : questions,
        "followers" : followers,
        "userTags" : userTags
    }
    
    return data;
    
}

const getTagFollowers = async (id) => {

    if(!id) throw "Must provide an Id";
    if(typeof id !=="string") throw "id is not of correct type"

    const usersCollection = mongocollection.Users;
    const usersDB = await usersCollection();
    const followers = await usersDB.find({ tags : { $elemMatch : {$eq : id } }}).project({userName:1,email:1,_id:0}).toArray();
    return followers;
} 

const getTag = async (id) => {
    if(!id) throw "Must provide an ID";

    const tagcollection = await tags();
    const tag = await tagcollection.findOne({_id:ObjectID(id)});
    
    const usersCollection = mongocollection.Users;
    const usersDB = await usersCollection();

    const questions = [];
    for(var qid of tag.questionid){
        var question = undefined;

        try {
            question = await questionsDataAPI.getquestion(qid.toString());
            question.userName = await usersDB.find({email : question.userid}).project({userName:1,_id:0}).toArray();
            question.userName = question.userName[0].userName;
        }catch(err){
            continue;
        }
        
        if(question) questions.push(question);
    }

    const data = {
        "id" : id,
        "title" : tag.tag,
        "tag" : tag,
        "questions" : questions
    }
    
    return data;
}

const getTagbyname= async(name)=>{
    if(!name || typeof(name)!=="string") throw "Name is not properly defined"
        const tagcollection = await tags();
        const tag =await tagcollection.findOne({tag:name})
        if(!tag) throw "No tag with that name found"
        return tag

   

}

async function getAllTags(){ 
    const tagcollection = await tags();
    const allTag = await tagcollection.find({}).toArray();
    return allTag;
}


module.exports={
    addtags,
    removetags,
    getAllTagsData,
    getTag,
    getTagbyname,
    getTagFollowers,
    getAllTags
}

