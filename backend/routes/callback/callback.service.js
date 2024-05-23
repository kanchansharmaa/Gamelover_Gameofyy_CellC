const pool = require('../../config/db')
require('dotenv').config()
const moment = require('moment');

const { default: axios } = require("axios");
module.exports = {

  insertCallback: (data, callback) => {
    //  console.log("data in service", data)

    const {
      mt,
      client,
      requestId,
      operator,
      telNo,
      statusId,
      statusTime,
      statusMessage,
      source,
      rxTelNo,
      rxMessage,
      ai,
      refId,
      adTracking,
      ext_ref
    } = data;


    const insertCallbackLogs = process.env.insertCallbackLogs
      .replace('<type_event>', mt)
      .replace('<client>', client)
      .replace('<requestId>', requestId)
      .replace('<operator>', operator)
      .replace('<msisdn>', telNo)
      .replace('<statusId>', statusId)
      .replace('<statusTime>', statusTime)
      .replace('<statusMessage>', statusMessage)
      .replace('<source>', source)
      .replace('<rxTelNo>', rxTelNo)
      .replace('<rxMessage>', rxMessage)
      .replace('<ai>', ai)
      .replace('<refId>', refId)
      .replace('<adTracking>', adTracking)
      .replace('<ext_ref>', ext_ref)




    // console.log("insertCallbackLogs ", insertCallbackLogs);

    pool.query(`${insertCallbackLogs}`, [], (err, result) => {

      if (err) return callback(err);
      else return callback("", "Success");
    });
  },


  checkUserExists: (msisdn, callback) => {
    console.log("msisdn", msisdn)
    const checkIfUserExist = process.env.checkuserValidation
      .replace("<msisdn>", msisdn)

    // console.log("checkIfUserExist", checkIfUserExist);
    pool.query(`${checkIfUserExist}`, [], (err, result) => {
      if (err) return callback(err);

      return callback("", result);
    });
  },

  //   insertbillingsuccess: (data, callback) => {
  //     const {
  //         client,
  //         requestId,
  //         operator,
  //         telNo,
  //         statusId,
  //         statusTime,
  //         statusMessage,
  //         ai,
  //         refId,
  //         adTracking,
  //         ext_ref
  //     } = data;

  //     const checkBillingCount = `SELECT COUNT(1) AS billingcount FROM tbl_billing_success WHERE msisdn='${telNo}'`;

  //     pool.query(checkBillingCount, [], (err, result) => {
  //         if (err) return callback(err);

  //         let mt = result[0].billingcount > 0 ? 'REN' : 'SUB';
  //         console.log("mt===", mt)

  //         const statusTimeDate = new Date(statusTime);
  //         statusTimeDate.setDate(statusTimeDate.getDate() + 1);
  //         const nextBilledDate = statusTimeDate.toISOString().slice(0, 19).replace('T', ' ');


  //         const insertBillingSuccess = process.env.insertIntoBillingSuccess
  //             .replace('<msisdn>', telNo)
  //             .replace('<client>', client)
  //             .replace('<billingdate>', statusTime)
  //             .replace('<operator>', operator)
  //             .replace('<requestId>', requestId)
  //             .replace('<statusId>', statusId)
  //             .replace('<statusMessage>', statusMessage)
  //             .replace('<type_event>', mt)
  //             .replace('<nextbilled_date>', nextBilledDate)
  //             .replace('<ai>', ai)
  //             .replace('<refId>', refId)
  //             .replace('<adTracking>', adTracking)
  //             .replace('<ext_ref>', ext_ref);

  //         // Insert into the database
  //         pool.query(`${insertBillingSuccess}`, [], (err, result) => {
  //             if (err) return callback(err);
  //             else return callback("", "Success");
  //         });
  //     });
  // },

  insertbillingsuccess: (data, callback) => {
    const {
      client,
      requestId,
      operator,
      telNo,
      statusId,
      statusTime,
      statusMessage,
      ai,
      refId,
      adTracking,
      ext_ref
    } = data;
  
    const checkBillingCount = `SELECT COUNT(1) AS billingcount FROM tbl_billing_success WHERE msisdn='${telNo}'`;
    const checkUnsubCount = `SELECT COUNT(1) AS unsubcount FROM tbl_subscription_unsub WHERE msisdn='${telNo}'`;
  
    // Query for billing count
    pool.query(checkBillingCount, [], (err, billingResult) => {
      if (err) return callback(err);
  
      // Query for unsub count
      pool.query(checkUnsubCount, [], (err, unsubResult) => {
        if (err) return callback(err);
  
        const billingCount = billingResult[0].billingcount;
        const unsubCount = unsubResult[0].unsubcount;
        console.log("billing counbt", billingCount, "usnubcount", unsubCount)
        // Determine mt based on counts
        let mt = '';
        if (billingCount > 0 && unsubCount == 0) {
          mt = 'REN';
        } else if (billingCount > 0 && unsubCount > 0) {
          mt = 'SUB';
        } else if (billingCount == 0 && unsubCount == 0) {
          mt = 'SUB';
        }
        else{
          mt='SUB'
        }
  
        console.log("mt===", mt);
  
        // Use Moment.js to handle empty statusTime
        const effectiveStatusTime = statusTime || moment().format('YYYY-MM-DD HH:mm:ss');
        const statusTimeDate = new Date(effectiveStatusTime);
        statusTimeDate.setDate(statusTimeDate.getDate() + 1);
        const nextBilledDate = statusTimeDate.toISOString().slice(0, 19).replace('T', ' ');
  
        console.log("Effective status time:", effectiveStatusTime, "Next billed date:", nextBilledDate);
  
        const insertBillingSuccess = process.env.insertIntoBillingSuccess
          .replace('<msisdn>', telNo)
          .replace('<client>', client)
          .replace('<billingdate>', effectiveStatusTime) // Use the effectiveStatusTime
          .replace('<operator>', operator)
          .replace('<requestId>', requestId)
          .replace('<statusId>', statusId)
          .replace('<statusMessage>', statusMessage)
          .replace('<type_event>', mt)
          .replace('<nextbilled_date>', nextBilledDate)
          .replace('<ai>', ai)
          .replace('<refId>', refId)
          .replace('<adTracking>', adTracking)
          .replace('<ext_ref>', ext_ref);
  
        // Insert into the database
        pool.query(insertBillingSuccess, [], (err, result) => {
          if (err) return callback(err);
          else return callback("", "Success");
        });
      });
    });
  },
  

  insertsubscription: (data, callback) => {
    //  console.log("data in service", data)

    let {
      mt,
      client,
      requestId,
      operator,
      telNo,
      statusId,
      statusTime,
      statusMessage,
      ai,
      refId,
      adTracking,
      ext_ref
    } = data;

    if (mt === 'tnSubscribe') {
      mt = 'SUB'
    }
    const statusTimeDate = new Date(statusTime);
    statusTimeDate.setDate(statusTimeDate.getDate() + 1);
    const nextBilledDate = statusTimeDate.toISOString().slice(0, 19).replace('T', ' ');


    // console.log("env query", process.env.insertIntoSubscription)

    const insertSubscription = process.env.insertIntoSubscription
      .replace('<msisdn>', telNo)
      .replace('<client>', client)
      .replace('<requestId>', requestId)
      .replace('<operator>', operator)
      .replace('<type_event>', mt)
      .replace('<statusId>', statusId)
      .replace('<subdatetime>', statusTime)
      .replace('<statusMessage>', statusMessage)
      .replace('<nextbilled_date>', nextBilledDate)
      .replace('<ai>', ai)
      .replace('<refId>', refId)
      .replace('<adTracking>', adTracking)
      .replace('<ext_ref>', ext_ref);



    // console.log("insertSubscription ", insertSubscription);

    pool.query(`${insertSubscription}`, [], (err, result) => {

      if (err) return callback(err);
      else return callback("", "Success");
    });
  },

  deleteSubscription: (data, callback) => {
    // console.log("unsub data\n", data)
    const {
      telNo,
      mt,
      source,
      statusTime,
      rxTelNo,
      rxMessage,
      client,
      requestId
    } = data;

    // console.log("env query for unsub", process.env.insertIntoTblUnsub);

    const insertIntoTblUnsub = process.env.insertIntoTblUnsub
      .replace('<msisdn>', telNo)
      .replace('<type_event>', 'UNSUB')
      .replace('<source>', source)
      .replace('<unsub_datetime>', statusTime)
      .replace('<rxTelNo>', rxTelNo)
      .replace('<rxMessage>', rxMessage)
      .replace('<client>', client)
      .replace('<requestId>', requestId);

    // console.log("insertIntoTblUnsub", insertIntoTblUnsub);

    // Insert into tbl_subscription_unsub
    pool.query(insertIntoTblUnsub, [], (err, insertResult) => {
      if (err) {
        console.error("Error inserting into tbl_subscription_unsub", err);
        return callback(err);
      }



      const deleteSubQuery = process.env.deletefromSubscription.replace('<msisdn>', telNo);


      pool.query(deleteSubQuery, [], (err, deleteResult) => {
        if (err) {
          console.error("Error deleting from tbl_subscription", err);
          return callback(err);
        }

        return callback(null, "Success in unsubscribing");
      });
    });
  },


  updateSubscription: (data, callback) => {
    const {
      telNo,
      mt,
      statusId,
      statusTime,
      statusMessage,
    } = data;

    // Use Moment.js to handle empty statusTime
    const effectiveStatusTime = statusTime || moment().format('YYYY-MM-DD HH:mm:ss');
    console.log("upsate subm ", statusTime, "new itme", effectiveStatusTime)
    const statusTimeDate = new Date(effectiveStatusTime);
    statusTimeDate.setDate(statusTimeDate.getDate() + 1);
    const nextBilledDate = statusTimeDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log("nextbilled", nextBilledDate)

    const updateSubscription = process.env.updateTblSubscription
      .replace('<msisdn>', telNo)
      .replace('<type_event>', 'REN')  // assuming mt is always 'REN' for renewal in this context
      .replace('<statusId>', statusId)
      .replace('<nextbilled_date>', nextBilledDate)
      .replace('<last_billed>', effectiveStatusTime) // Use the formatted effectiveStatusTime
      .replace('<statusMessage>', statusMessage);

    pool.query(`${updateSubscription}`, [], (err, result) => {
      if (err) return callback(err);
      else return callback("", "Success");
    });
  },


  // insertbillingfailed: (data, callback) => {
  //   //  console.log("data in service", data)

  //   const {
  //     mt,
  //     telNo,
  //     statusId,
  //     statusTime,
  //     statusMessage,
  //   } = data;


  //   const insertBillingfailed = process.env.insertIntoBillingFailed
  //     .replace('<msisdn>', telNo)
  //     .replace('<type_event>', 'UNSUB')
  //     .replace('<statusId>', statusId)
  //     .replace('<statusTime>', statusTime)
  //     .replace('<statusMessage>', statusMessage)


  //   pool.query(`${insertBillingfailed}`, [], (err, result) => {

  //     if (err) return callback(err);
  //     else return callback("", "Success");
  //   });
  // },



  insertbillingfailed: (data, callback) => {
    // console.log("data in service", data)
    const {
      mt,
      telNo,
      statusId,
      statusTime,
      statusMessage,
    } = data;

    // Check if statusTime is empty and use current datetime if it is
    const effectiveStatusTime = statusTime || moment().format('YYYY-MM-DD HH:mm:ss');
    console.log("sttays time", statusTime, "new time", effectiveStatusTime)
    const insertBillingfailed = process.env.insertIntoBillingFailed
      .replace('<msisdn>', telNo)
      .replace('<type_event>', 'UNSUB')
      .replace('<statusId>', statusId)
      .replace('<statusTime>', effectiveStatusTime)
      .replace('<statusMessage>', statusMessage)

    pool.query(`${insertBillingfailed}`, [], (err, result) => {
      if (err) return callback(err);
      else return callback("", "Success");
    });
  },

  sendPromotionExistNumberHit: async (ani, ext_ref, serviceId, callback) => {
    const url = process.env.FORWARD_SUBPROMOTION
      .replace("<ANI>", ani)
      .replace("<EXT_REF>", ext_ref)
      .replace("<SERVICE_ID>", serviceId);

    console.log("URL for Axios call: ", url);

    try {
      console.log("Making Axios GET request");
      const response = await axios.get(url);
      console.log("Response Data: ", response.data);
      return callback("", response.data);
    } catch (err) {

      return callback(err);
    }
  },


  insertBillingrecord: (data, callback) => {
    //  console.log("data in service", data)

    const {

      client,
      requestId,
      operator,
      telNo,
      statusId,

    } = data;


    const insertbillingrecord = process.env.insertTableBillingrecord
      .replace('<msisdn>', telNo)
      .replace('<client>', client)
      .replace('<requestId>', requestId)
      .replace('<operator>', operator)
      .replace('<statusId>', statusId)
      .replace('<record_status>', 0)
      .replace('<noattempts>', 1)

    console.log("insertbillingrecord ", insertbillingrecord);

    pool.query(`${insertbillingrecord}`, [], (err, result) => {

      if (err) return callback(err);
      else return callback("", "Success");
    });
  },

  deleteFrombillingRecord: (telNo, callback) => {
    console.log("telno", telNo)
    const deleteSubQuery = process.env.deletfromtblbilling.replace('<msisdn>', telNo);
    console.log("deleteSubQuery", deleteSubQuery)
    pool.query(deleteSubQuery, [], (err, deleteResult) => {
      if (err) {
        console.error("Error deleting from tbl_subscription", err);
        return callback(err);
      }

      return callback(null, "Success in unsubscribing");
    });
  },


}