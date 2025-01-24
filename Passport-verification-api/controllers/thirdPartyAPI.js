import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const generateOtpAadhaar = async (aadhaar_number, user_id) => {
    try {

        const url = "https://api.gridlines.io/aadhaar-api/boson/generate-otp";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
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
            timeout: 0 // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
        });

        console.log("api aadhaar response: " + response);
        const transactionId = response.headers.get('x-transaction-id');
        console.log("api aadhaar transactionId: " + transactionId);
        
        
        if(response.ok){
            return transactionId;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
};

export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
    try {

        const url = "https://api.gridlines.io/aadhaar-api/boson/submit-otp";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
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
            timeout: 0 // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
        });

       
        
        if(response.ok){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
};