const express=require('express')
const router=express.Router();

const {sendBillingRequest}=require("./billing.controller")

router.post('/',sendBillingRequest)



module.exports=router