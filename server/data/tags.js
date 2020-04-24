const mongocollection = require('../config/mongoCollections');
const ObjectID= require("mongodb").ObjectID
const tags = mongocollection.Tags


const addtags=async(tagarray ,questionid)=>{

    if(!tagarray) throw "No tags has been defined"
    if(!questionid) throw "No Question id has been defined"
    if(!Array.isArray(tagarray)) throw "Tags not of array type"
    if(typeof(questionid)===ObjectID) throw "Question id not of ObjectId type"

    const tagcollection = await tags()
    for (let i=0;i<tagarray.length;i++){
        await tagcollection.updateOne({tag:tagarray[i]},{$addToSet:{questionid:questionid}},{upsert:true})

    }
    return;


}

module.exports={
    addtags
}

