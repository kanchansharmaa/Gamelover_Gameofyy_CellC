const express=require('express')
const router=express.Router();

const {getWAapDoi}=require("./SubDOI.controller")

router.get('/',getWAapDoi)



module.exports=router