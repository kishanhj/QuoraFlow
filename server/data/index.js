const mongocollection = require('../config/mongoCollections');
const questions= require("./question")
const tags= require("./tags")


// async function main(){
//     try{
//         const animalinfo=await q
//         console.log(animalinfo)

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }




module.exports={
    questions,
    tags
}