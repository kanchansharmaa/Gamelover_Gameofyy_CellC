
const { insertCallback, insertsubscription, insertbillingsuccess,sendPromotionExistNumberHit, deleteSubscription, checkUserExists, insertbillingfailed, updateSubscription } = require('./callback.service');
const {sendSMS}=require('../SMS/Sms.controller')

const builder = require('xmlbuilder');


module.exports = {

    getCallback: (req, res) => {
        const details = req.query;
        console.log("callback", details);

        if (details.mt == 'tnUnsubscribe') {
            details.mt = 'UNSUB';
        } else if (details.mt == 'sdResult') {
            details.mt = 'REN';
        } else if (details.mt == 'tnSubscribe') {
            details.mt = 'SUB';
        }

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
            } else {
                console.log("Inserted in callback", result);


                if (data.mt == 'SUB') {
                    insertbillingsuccess(data, (err, billingResult) => {
                        if (err) {
                            console.error('Error in insertbillingsuccess', err);
                            return res.status(500).send('Error');
                        }
                        console.log("Billing success", billingResult);
                        insertsubscription(data, (err, subscriptionResult) => {
                            if (err) {
                                console.error('Error in insertsubscription', err);
                                return res.status(500).send('Error');
                            }

                            
                            console.log("Subscription success", subscriptionResult);

                       
                            sendPromotionExistNumberHit(
                                data.telNo,
                                data.ext_ref,
                                179,
                                (err, promoCallback) => {
                                    if (err) {
                                        console.error('Error in sendPromotionExistNumberHit', err.response.data);
                                   
                                    } else {
                                       
                                    }
                                }
                            );
                            const xmlResponse = builder.create('r')
                                .ele('errorCode', '0')
                                .end({ pretty: true });
                            return res.type('application/xml').send(xmlResponse);
                        });
                    })
                }

                else if (data.mt == 'REN') {

                    if (data.statusId == '0') {
                        insertbillingsuccess(data, (err, billingResult) => {
                            if (err) {
                                console.error('Error in insertbillingsuccess', err);
                                return res.status(500).send('Error ');
                            }
                            updateSubscription(data, (err, updateResult) => {
                                if (err) {
                                    console.error('Error in updateSubscription', err);
                                    return res.status(500).send('Error');
                                }
                                console.log("Billing confirmed and subscription updated", updateResult);
                                const xmlResponse = builder.create('r')
                                    .ele('errorCode', '0')
                                    .end({ pretty: true });

                                return res.type('application/xml').send(xmlResponse);
                            });
                        });
                    } 
                    else if (data.statusId == '106') {
                        insertbillingfailed(data, (err, billingFailedResult) => {
                            if (err) {
                                console.error('Error in insertbillingfailed', err);
                                return res.status(500).send('Error ');
                            }
                            console.log("Billing failed due to insufficient funds", billingFailedResult);
                            const xmlResponse = builder.create('r')
                                .ele('errorCode', '0')
                                .end({ pretty: true });

                            return res.type('application/xml').send(xmlResponse);
                        });
                    } else {
                        return res.send('Unknown statusMessage for REN');
                    }
                } 
                else if (data.mt == 'UNSUB') {
                    deleteSubscription(data, (err, deleteResult) => {
                        if (err) {
                            console.error('Error in deleteSubscription', err);
                            return res.status(500).send('Error ');
                        }
                        console.log("Unsubscription success", deleteResult);
                        const xmlResponse = builder.create('r')
                            .ele('errorCode', '0')
                            .end({ pretty: true });

                        return res.type('application/xml').send(xmlResponse);
                    });
                } 
                
                else {
                   
                    return res.send('Unknown callabck type');
                }
            }
        });
    },

    checkUser: (req, res) => {
        const { msisdn } = req.body;
    
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


    
    
};








