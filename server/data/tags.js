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

    const tagcollection = await tags()
    for (let i=0;i<tagarray.length;i++){
        await tagcollection.update({tag:tagarray[i]},{ $pull: { questionid: questionid } })

    }
    return;


}

const getAllTagsData = async (id) => {
    
    if(!id) throw "Must provide an Id";
    if(typeof id !=="string") throw "id is not of correct type"

    const tagcollection = await tags();
    const tag = await tagcollection.findOne({_id:ObjectID(id)});

    const questions = [];
    for(var qid of tag.questionid){
        var question = undefined;

        try {
            question = await questionsDataAPI.getquestion(qid.toString());
        }catch(err){
            continue;
        }
        
        if(question) questions.push(question);
    }

    const usersCollection = mongocollection.Users;
    const usersDB = await usersCollection();
    const followers = await usersDB.find({ tags : { $elemMatch : {$eq : id } }}).project({userName:1,_id:0}).toArray();

    const data = {
        "id" : id,
        "title" : tag.tag,
        "questions" : questions,
        "followers" : followers
    }
    
    return data;
    
}

const getTag = async (id) => {
    if(!id) throw "Must provide an ID";

    
    const tagcollection = await tags();
    const tag = await tagcollection.findOne({_id:ObjectID(id)});
    const questions = [];
    for(var qid of tag.questionid){
        var question = undefined;

        try {
            question = await questionsDataAPI.getquestion(qid.toString());
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


module.exports={
    addtags,
    removetags,
    getAllTagsData,
    getTag,
    getTagbyname
}

