const axios = require('axios');
const crypto = require('crypto');

function generateMD5Signature(params, password) {

    const concatenatedString = Object.values(params).join('') + password;

    const hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
    return hash;
}

module.exports = {
    sendSMS: async (telNoo, res) => {
        console.log("telNo sms", telNoo)
        const service = 'AW_UW_GamesLover_R4';
        const from = "27616494992";
        const text = `Welcome to Gamelover R4/day subscription. To Cancel SMS: Glover Off to 31009. CC 0861131009. Easy Access: http://gamelover.gameofyy.com/login`;
        console.log("text", text)
        const password = '17ccc62f';

        const params = {
            Client: service,
            To: from,
            Text: text
        };


        const sign = generateMD5Signature(params, password);


        params.Sign = sign;


        const baseUrl = 'http://wpgw.worldplay.co.za:9269/api/ArbeesMT.dll';
        const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
        const url = `${baseUrl}?${queryString}`;

        console.log("URL:", url);
        

        try {
            const response = await axios.get(url);
            console.log("Response SMS request:", response.data);
            return response.data; 
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            res.status(500).send("Error sending SMS");
            // return error.response
        }
    }
};
