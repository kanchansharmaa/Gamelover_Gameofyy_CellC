
const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


// Serve static files from the 'public' directory


module.exports = {
    getWAapDoi : (req, res) => {
        const { ext_ref } = req.query;
        console.log("extref", ext_ref);

        const sn = 'AW_UW_GamesLover_R4';
        const dos = 's';
        const password = '17ccc62f';
        const tn = '';
        const cl = 'AW_UW_GamesLover_R4';
        const sp = '400';
        const bf = 'Day';
        // awst6586400 rfreuyft743thfwrkfn3w785634w98jfj
        const concatenatedString = sn + tn + dos + sp + bf + password;
        const md5Hash = crypto.createHash('md5').update(concatenatedString).digest('hex');

        const queryParams = {
            cl: cl,
            do: dos,
            tn: tn,
            sp: sp,
            bf: bf,
            mh: md5Hash
        };

        console.log("queryparam", queryParams);

        const queryParam = {
            cl: cl,
            do: dos,
            sp: sp,
            bf: bf,
            mh: md5Hash,
        };

        const uuid = uuidv4();
        console.log("UUID:", uuid);

      
        // let imageUrl = 'http://148.251.88.109:1452/images/gamelogo.png'; 
        let imageUrl = 'http://gamelover.gameofyy.com/images/gamelogo.png?width=286&height=126'; 

        let encodedImageUrl = encodeURIComponent(imageUrl);
        console.log("encodede",encodedImageUrl)

        const queryString = new URLSearchParams(queryParam).toString(); 
        console.log("querystring", queryString);

        const redirectUrl = `http://wap.zero9.co.za/mesh/WapDoiRequest.php?${queryString}&ext_ref=${ext_ref}&bl=${encodedImageUrl}`;
    
        console.log("Redirect URL:", redirectUrl);
    
        res.redirect(redirectUrl); 
    }
};
