const questiontroutes =require("./question")
const tagsroutes= require("./tags")


const constructorMethod = app => {
    app.use("/questions", questiontroutes);
    app.use("/tags", tagsroutes);
    app.use("*",(req,res)=>{
        res.status(404).json({error:"Not Found"});
    })
}

module.exports=constructorMethod;