const router = require("express").Router();
const messages = require("../../config/messages");
const makeCallback = require("../../utils/callback");

router.get(
    "/",(req,res)=>{
        res.json({
            msg:"hello Backend"
        })
    }
    
);

module.exports = router;
