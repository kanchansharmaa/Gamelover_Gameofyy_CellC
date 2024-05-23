// const crypto = require('crypto');
// const axios = require('axios'); // Ensure axios is installed
// const { v4: uuidv4 } = require('uuid');
// module.exports = {
//     sendBillingRequest: async (req, res) => {
//         const url = 'http://wpgw.worldplay.co.za:9269/api/Arbees.dll';
//         const mt = 'sdRequest';
//         const service = 'AW_UW_GamesLover_R4';
//         const operator = 'CellC';
//         const telNo = 27620044120; 
//         const amount = 400;
//         let uuid = uuidv4();
//         const refId = uuid;
//         console.log("refid:", refId);
//         const password = '17ccc62f';

       
//         const concatenatedString = mt + service + operator + telNo + amount + refId + password;
//         console.log("Concatenated string:", concatenatedString);

       
//         const hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
//         console.log("MD5 hash:", hash);

       
//         const params = {
//             mt: mt,
//             service: service,
//             Operator: operator,
//             TelNo: telNo,
//             amount: amount,
//             RefId: refId,
//             sign: hash  
//         };


//         console.log("params", params)
       
//         const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
//         const fullUrl = `${url}?${queryString}`;

//         console.log("URL:", fullUrl);

     
//         try {
//             const response = await axios.get(fullUrl);
//             console.log("Response:", response.data);
//             res.status(200).send(response.data); 
//         } catch (error) {
//             // console.error("Error:", error.response ? error.response.data : error.message);
//             res.status(500).send(error.response ? error.response.data : error.message);
//         }
//     }
// }

const crypto = require('crypto');
const axios = require('axios'); // Ensure axios is installed

async function sendBillingRequest(telNoo) {
    console.log("tellno in billing ", telNoo)
    const url = 'http://wpgw.worldplay.co.za:9269/api/Arbees.dll';
    const mt = 'sdRequest';
    const service = 'AW_UW_GamesLover_R4';
    const operator = 'CellC';
    const amount = 400;
    const telNo='27620044120'
    let refId = crypto.randomInt(1, 2147483648); // Generate a random integer between 1 and 2147483647
    console.log("refid:", refId);

    const concatenatedString = `${mt}${service}${operator}${telNo}${amount}${refId}17ccc62f`;
    console.log("Concatenated string:", concatenatedString);

    const hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
    console.log("MD5 hash:", hash);

    const params = {
        mt: mt,
        service: service,
        Operator: operator,
        TelNo: telNo,
        amount: amount,
        RefId: refId,
        sign: hash
    };

    console.log("params", params);

    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const fullUrl = `${url}?${queryString}`;

    console.log("URL:", fullUrl);

    try {
        const response = await axios.get(fullUrl);
        console.log("Response billing request :", response.data);

        return response.data; 
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw new Error('Billing request failed');  // Throw an error to handle in the calling function
    }
}

module.exports = {
    sendBillingRequest
};




