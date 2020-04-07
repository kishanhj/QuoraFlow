const questiontroutes =require("./question")


const constructorMethod = app => {
    app.use("/questions", questiontroutes);
    app.use("*",(req,res)=>{
        res.status(404).json({error:"Not Found"});
    })
}

module.exports=constructorMethod;