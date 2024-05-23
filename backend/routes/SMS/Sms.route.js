const express=require('express')
const router=express.Router();

const {sendSMS}=require("./Sms.controller")


router.post('/',sendSMS)


module.exports=router