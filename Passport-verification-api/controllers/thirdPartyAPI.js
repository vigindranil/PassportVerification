// import fetch from 'node-fetch';
// import dotenv from 'dotenv';
// dotenv.config();

// export const generateOtpAadhaar = async (aadhaar_number, user_id) => {
//     try {

//         const url = "https://api.gridlines.io/aadhaar-api/boson/generate-otp";
//         const headers = {
//             "Accept": "application/json",
//             "Content-Type": "application/json",
//             "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
//             "X-Auth-Type": "API-Key"
//         };

//         const body = JSON.stringify({
//             "aadhaar_number": aadhaar_number,
//             "consent": "Y",
//             "user_id": user_id
//         });

//         const response = await fetch(url, {
//             method: "POST",
//             headers: headers,
//             body: body,
//             timeout: 0 // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
//         });

//         const transactionId = response.headers.get('x-transaction-id');
        
//         if(response.ok){
//             return transactionId;
//         }else{
//             return false;
//         }

//     } catch (error) {
//         return false;
//     }
// };


import fetch from 'node-fetch';
import dotenv from 'dotenv';
import logger from '../utils/logger.js'; // Import logger

dotenv.config();

export const generateOtpAadhaar = async (aadhaar_number, user_id) => {
    try {
        logger.info(`Starting OTP generation for Aadhaar number: ${aadhaar_number}, User ID: ${user_id}`);
        
        const url = "https://api.gridlines.io/aadhaar-api/boson/generate-otp";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-Key": process.env.AADHAAR_API_KEY, // Prefer environment variables for sensitive data
            "X-Auth-Type": "API-Key"
        };

        const body = JSON.stringify({
            "aadhaar_number": aadhaar_number,
            "consent": "Y",
            "user_id": user_id
        });

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body,
            timeout: 0
        });

        const transactionId = response.headers.get('x-transaction-id');
        
        if (response.ok) {
            logger.info(`OTP generated successfully for User ID: ${user_id}, Transaction ID: ${transactionId}`);
            return transactionId;
        } else {
            logger.error(`Failed to generate OTP for User ID: ${user_id}. Response status: ${response.status}`);
            return false;
        }
    } catch (error) {
        logger.error(`Error generating OTP for User ID: ${user_id}. Error: ${error.message}`);
        return false;
    }
};

// export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
//     try {

//         const url = "https://api.gridlines.io/aadhaar-api/boson/submit-otp";
//         const headers = {
//             "Accept": "application/json",
//             "Content-Type": "application/json",
//             "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
//             "X-Auth-Type": "API-Key",
//             "X-Transaction-ID": transaction_id
//         };

//         const body = JSON.stringify({
//             "otp": otp,
//             "include_xml": true,
//             "share_code": "1001",
//             "user_id": user_id
//         });

//         const response = await fetch(url, {
//             method: "POST",
//             headers: headers,
//             body: body,
//             timeout: 0 // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
//         });

       
        
//         if(response.ok){
//             return true;
//         }else{
//             return false;
//         }

//     } catch (error) {
//         return false;
//     }
// };

export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
    try {
        logger.info(`Verifying OTP for User ID: ${user_id}, Transaction ID: ${transaction_id}`);
        
        const url = "https://api.gridlines.io/aadhaar-api/boson/submit-otp";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-Key": process.env.AADHAAR_API_KEY, // Prefer environment variables for sensitive data
            "X-Auth-Type": "API-Key",
            "X-Transaction-ID": transaction_id
        };

        const body = JSON.stringify({
            "otp": otp,
            "include_xml": true,
            "share_code": "1001",
            "user_id": user_id
        });

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body,
            timeout: 0
        });

        if (response.ok) {
            logger.info(`OTP verified successfully for User ID: ${user_id}, Transaction ID: ${transaction_id}`);
            return true;
        } else {
            logger.error(`Failed to verify OTP for User ID: ${user_id}, Transaction ID: ${transaction_id}. Response status: ${response.status}`);
            return false;
        }
    } catch (error) {
        logger.error(`Error verifying OTP for User ID: ${user_id}, Transaction ID: ${transaction_id}. Error: ${error.message}`);
        return false;
    }
};