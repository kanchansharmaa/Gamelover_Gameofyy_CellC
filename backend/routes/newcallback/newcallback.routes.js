
const express=require('express')
const router=express.Router();

const {getSubcallback,getRenewalCallback,getUnsubCallback}=require("./newcallback.controller")

router.get('/susbcribe',getSubcallback)
router.get('/unsubscribe',getUnsubCallback)
router.get('/billing', getRenewalCallback)


module.exports=router