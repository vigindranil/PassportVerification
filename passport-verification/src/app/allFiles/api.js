import { postFileRequest, postRequest } from "../commonAPI";

export const acceptApplication = async (applicationId, citizentype, file) => {
    try {
        const macAddress = "test-s4dn-3aos-dn338";
        const locationIp = "115.187.62.100";
        const deviceId = "TEST-39U4HR49N3N9";
        return await postFileRequest("upload/acceptCaseUploadDocument", {
            applicationId, citizentype, docTypeId: 13, file, macAddress,
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
        const macAddress = "-";
        const locationIp = "-";
        const deviceId = "-";
        return await postRequest("application/updateEnquiryStatus", {
            "ApplicationID": applicationId,
            "locationIp": "115.187.62.100",
            "macAddress": "test-s4dn-3aos-dn338",
            "deviceId": "123#df",
            "StatusID": "50",
            "StatusText": type == 'accept' ? 'OC APPROVED' : 'OC NOT APPROVE',
            "Remarks": remarks
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}