const xml2js = require('xml2js');

async function parseBillingResponse(billingResponseXML) {
    // Create a new XML parser with explicitArray set to false to avoid unnecessary arrays
    const parser = new xml2js.Parser({ explicitArray: false });

    try {
        // Parse the XML string
        const result = await parser.parseStringPromise(billingResponseXML);
        console.log("Parsed XML:", result);

        // Accessing the statusId from the parsed XML object
        const statusId = result.responseBody.statusId;
        console.log("Status ID:", statusId);

        return statusId; // You can return it if needed or use it directly as needed
    } catch (error) {
        console.error("Error parsing XML:", error);
        throw error; // Rethrow or handle as needed
    }
}

// Example XML string from your response
const xml = `<?xml version="1.0" encoding="utf-8"?>
<responseBody>
    <errorCode>0</errorCode>
    <errorDescription>OK: TxId=1031756190, TxIdStr=3D7F599E</errorDescription>
    <requestId>1031756190</requestId>
    <operator>CellC</operator>
    <statusId>0</statusId>
</responseBody>`;

// Call the function to parse and handle the XML
parseBillingResponse(xml)
    .then(statusId => {
        // Further processing based on statusId
        console.log("Further processing with Status ID:", statusId);
    })
    .catch(err => {
        // Handle errors here
        console.error("Error processing XML:", err);
    });
