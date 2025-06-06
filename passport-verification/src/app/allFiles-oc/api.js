import { postFileRequest, postRequest } from "../commonAPI";

export const acceptApplication = async (applicationId, citizentype, file) => {
    try {
        const macAddress = "test-s4dn-3aos-dn338";
        const locationIp = "115.187.62.100";
        const deviceId = "TEST-39U4HR49N3N9";
        return await postFileRequest("upload/acceptCaseUploadDocument", {
            applicationId, citizentype, DocTypeId: 13, file, macAddress,
            locationIp,
            deviceId
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

export const updateEnquiryStatus = async (applicationId, type, remarks) => {
    try {
        const use_details = await fetch("https://ipinfo.io/json");
        const user_details_json = await use_details.json();
    
        const locationIp = user_details_json?.ip;
        
        return await postRequest("application/updateEnquiryStatus", {
            "ApplicationID": applicationId,
            "locationIp": locationIp,
            "macAddress": "-",
            "deviceId": "-",
            "StatusID": type == 'send-back-to-eo' ? "5" : "50",
            "StatusText": type == 'send-back-to-eo' ? 'Back TO EO' : type == 'approve' ? 'OC APPROVED' : 'OC NOT APPROVE',
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}