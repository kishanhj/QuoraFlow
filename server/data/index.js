const mongocollection = require('../config/mongoCollections');
const questions= require("./question")
const tags = require("./tags")
const users = require("./users")


// async function main(){
//     try{
//         const animalinfo= await tags.getTagbyname('<ALERT>')
//         console.log(animalinfo)

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }
// main()




module.exports={
    questions,
    tags,
    users
}