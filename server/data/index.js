const mongocollection = require('../config/mongoCollections');
const questions= require("./question")
const tags= require("./tags")


// async function main(){
//     try{
//         const animalinfo= await tags.removetags(['General','Computer Science'],ObjectID('5eaa05a126b8682632dbf612'))

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }
// main()




module.exports={
    questions,
    tags
}