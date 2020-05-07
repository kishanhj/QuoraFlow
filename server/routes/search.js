const express= require("express")
const router = express.Router();
const searchUtils = require("../elasticSearch/searchAPI");

router.get("/",async (req,res) => {

    try{
        const query = req.query.q;
        const data = await searchUtils.doNormalSearch(query);
        res.status(200).json(data);
        return;
    } catch (e){
        res.status(500).json({"error" : e});
    }
});

module.exports = router;