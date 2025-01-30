import { postFileRequest, postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (applicationId, type, remarks) => {
    try {
        const macAddress = "-";
        const locationIp = "-";
        const deviceId = "-";
        return await postRequest("application/updateEnquiryStatus", {
            "ApplicationID": applicationId,
            "locationIp": "115.187.62.100",
            "macAddress": "test-s4dn-3aos-dn338",
            "deviceId": "123#df",
            "StatusID": "80",
            "StatusText": type == 'accept' ? 'SP APPROVED' : 'SP NOT APPROVE',
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}