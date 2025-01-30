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