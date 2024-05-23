
const { insertCallback, insertsubscription, insertbillingsuccess, deleteFrombillingRecord,insertBillingrecord,sendPromotionExistNumberHit, deleteSubscription, checkUserExists, insertbillingfailed, updateSubscription } = require('./callback.service');
const { sendSMS } = require('../SMS/Sms.controller');


const {sendBillingRequest} =require('../billing/billing.controller')
const xml2js = require('xml2js');
const builder = require('xmlbuilder');

module.exports = {
    getCallback: (req, res) => {
        const details = req.query;
        console.log("callback", details);

        const data = {
            mt: details.mt,
            client: details.client,
            requestId: details.requestId,
            operator: details.operator,
            telNo: details.telNo,
            amount: details.amount || null,
            statusId: details.statusId || null,
            statusTime: details.statusTime || details.subDate || null,
            statusMessage: details.statusMessage || null,
            source: details.source || null,
            rxTelNo: details.rxTelNo || null,
            rxMessage: details.rxMessage || null,
            ai: details.ai || null,
            refId: details.refId || null,
            adTracking: details.adTracking || null,
            ext_ref: details.ext_ref || null
        };

       
        insertCallback(data, (err, result) => {
            if (err) {
                console.error('Error in insertCallback', err);
                return res.status(500).send('Error');
            }
            console.log("Inserted in callback", result);

           
            if (data.mt === 'tnSubscribe') {
                insertsubscription(data, async (subErr, subResult) => {
                    if (subErr) {
                        console.error('Error in insertSubscription', subErr);
                        return res.status(500).send('Error in subscription');
                    }
                    console.log("Subscription inserted", subResult);
                      
                    try {
                        const billingResponseXML = await sendBillingRequest(data.telNo);
                        const parser = new xml2js.Parser({ explicitArray: false });
                        const parsedResult = await parser.parseStringPromise(billingResponseXML);
                        const billingResponse = parsedResult.responseBody;

                        if (billingResponse.statusId === '0') {
                            const smsResponse = await sendSMS(data.telNo);
                            console.log("SMS Response In controller =======\n", smsResponse);

                            sendPromotionExistNumberHit(
                                data.telNo,
                                data.ext_ref,
                                179,
                                (err, promoCallback) => {
                                    if (err) {
                                        console.error('Error in sendPromotionExistNumberHit', err.response ? (err.response.data || err.response.statusText) : err.message);
                                    } else {
                                        console.log('Promotion Exist Number Hit logged successfully', promoCallback);
                                    }
                                }
                            );
                        } 
                        else {
                          
                            console.log("Billing response indicated failure with statusId:", billingResponse.statusId);

                            // Insert record into billing record because statusId is not zero
                            insertBillingrecord(data, (err, recordResult) => {
                                if (err) {
                                    console.error('Error in insertBillingRecord', err);
                                    return res.status(500).send('Error inserting billing record');
                                }
                                console.log("Billing record inserted", recordResult);
                            });
                       
                        }
                
                        console.log("\n============================================================");
                        const xmlResponse = builder.create('r')
                            .ele('errorCode', '0')
                            .end({ pretty: true });
                        
                       
                        return res.type('application/xml').send(xmlResponse);
                    } 
                    
                    catch (error) {
                        console.error("Error in processing request:", error.message);
                        return res.status(500).send('Error in processing request');
                    }
                    
                });
            }
          
            else if (data.mt ==='sdResult') {
                switch (data.statusId) {
                    case '0':
                        insertbillingsuccess(data, (bsErr, bsResult) => {
                            if (bsErr) {
                                console.error('Error in insertBillingSuccess', bsErr);
                                return res.status(500).send('Error in billing success');
                            }
                            console.log("Billing success recorded", bsResult);
            
                            // Call to update subscription after successful billing insertion
                            updateSubscription(data, (usErr, usResult) => {
                                if (usErr) {
                                    console.error('Error in updateSubscription', usErr);
                                    return res.status(500).send('Error in updating subscription');
                                }
                                console.log("Subscription updated successfully", usResult);

                                deleteFrombillingRecord(data.telNo, (useErr, useResult) => {
                                    if (useErr) {
                                        console.error('Error in updateSubscription', useErr);
                                        return res.status(500).send('Error in deleting billing record');
                                    }
                                    console.log("user deleted successfully from tbl_billing", useResult);
                                });
                            });

                          
            
                            const xmlResponse = builder.create('r')
                            .ele('errorCode', '0')
                            .end({ pretty: true });
                            return res.type('application/xml').send(xmlResponse);
                        });
                        break;
                        
                    case '106':
                        insertbillingfailed(data, (bfErr, bfResult) => {
                            if (bfErr) {
                                console.error('Error in insertBillingFailed', bfErr);
                                return res.status(500).send('Error in billing failed');
                            }
                            console.log("Billing failed recorded", bfResult);
                            const xmlResponse = builder.create('r')
                            .ele('errorCode', '0')
                            .end({ pretty: true });
                            return res.type('application/xml').send(xmlResponse);
                        });
                        break;
                    default:
                        console.log("Status ID not handled:", data.statusId);
                }
            }
            else if (data.mt === 'tnUnsubscribe') {
                deleteSubscription(data, (err, deleteResult) => {
                    if (err) {
                        console.error('Error in deleteSubscription', err);
                        return res.status(500).send('Error ');
                    }
            
                    // Successful deletion from subscription, proceed to delete billing records
                    deleteFrombillingRecord(data.telNo, (err, billingDeleteResult) => {
                        if (err) {
                            console.error('Error in deleteFromBillingRecord', err);
                            return res.status(500).send('Error ');
                        }
            
                        console.log("Unsubscription and billing record deletion success", deleteResult, billingDeleteResult);
                        const xmlResponse = builder.create('r')
                            .ele('errorCode', '0')
                            .end({ pretty: true });
            
                        return res.type('application/xml').send(xmlResponse);
                    });
                });
            }
            
            else {
                   
                return res.send('Unknown callabck type');
            }
            
        });
    },


    checkUser: (req, res) => {
        let { msisdn } = req.query;
        console.log("Original msisdn", msisdn);
    
        // Check if 'msisdn' starts with '27', prepend '27' if it does not
        // if (!msisdn.startsWith('27')) {
        //     msisdn = '27' + msisdn;
        // }
    
        console.log("Modified msisdn", msisdn);
    
        checkUserExists(msisdn, (err, result) => {
            if (err) {
                console.error('Error', err);
                return res.status(500).send('Error');
            }
    
            let statusId = 0;
            if (result && result.length > 0) {
                statusId = 1;
            }
    
            return res.json({ "result": result, "statusId": statusId });
        });
    },
    

    
    parseXMLResponse: (req, res) => {
        const parser = new xml2js.Parser({ explicitArray: false });
        const exampleXML = `<?xml version="1.0" encoding="utf-8"?>
        <responseBody>
            <errorCode>0</errorCode>
            <errorDescription>OK: TxId=1031756190, TxIdStr=3D7F599E</errorDescription>
            <requestId>1031756190</requestId>
            <operator>CellC</operator>
            <statusId>999</statusId>
        </responseBody>`;

        parser.parseString(exampleXML, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                callback({});
                return;
            }

            console.log('Parsed XML Data:', result.responseBody.statusId);
            res.send(result.responseBody);  // Pass the responseBody which contains statusId and other data
        });
    },


    
    


    

    
};








