import { postFileRequest, postRequest } from "../commonAPI";

export const acceptApplication = async (applicationId, citizentype, file) => {
    try {

        const use_details = await fetch("https://ipinfo.io/json");
        const user_details_json = await use_details.json();
    
        const locationIp = user_details_json?.ip;
        const macAddress = "-";
        const deviceId = "-";
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
            "StatusID": "100",
            "StatusText": type == 'approve' ? 'SE APPROVED' : 'SE NOT APPROVE',
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}