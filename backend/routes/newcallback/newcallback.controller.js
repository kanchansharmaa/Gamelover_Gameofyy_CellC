


module.exports={
  
    getSubcallback:(req,res)=>{
        console.log("New Body Data\n", req.body)
        console.log("New Query Data=============================\n", req.query)
        console.log("params\n", req.param)

        res.send('Success')
    },

    getRenewalCallback:(req,res)=>{
        console.log("New Body \n", req.body)
        console.log("New Query Data==================================\n", req.query)
        console.log("params\n", req.param)

        res.send('Success')
    },

     getUnsubCallback:(req,res)=>{
        console.log("Body\n", req.body)
        console.log("Query\n ==========================================", req.query)
        console.log("params\n", req.param)

        res.send('Success')
    }
}