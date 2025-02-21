import { postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (applicationId, remarks) => {
    try {
        const macAddress = "-";
        const locationIp = "-";
        const deviceId = "-";
        
        return await postRequest("application/updateEnquiryStatus", {
            "ApplicationID": applicationId,
            "locationIp": "115.187.62.100",
            "macAddress": "t23d-s4dn-3aos-dn338",
            "deviceId": "98nf39937mp2eq",
            "StatusID": "10",
            "StatusText": "Verified by EO",
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}