const express=require('express')
const router=express.Router();

const {getCallback,checkUser,parseXMLResponse,}=require("./callback1.controller")

router.get('/notify-callback',getCallback)
router.get('/checkuser',checkUser)
router.get('/checkxml',parseXMLResponse)
// router.get('/recordbilling',recordbilling)


module.exports=router