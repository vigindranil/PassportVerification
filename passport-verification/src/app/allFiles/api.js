import { postFileRequest } from "../commonAPI";

export const acceptApplication = async (applicationId, citizentype, file) => {
    try {
        const macAddress = "-";
        const locationIp = "-";
        const deviceId = "-";
        return await postFileRequest("upload/acceptCaseUploadDocument", {
            applicationId, citizentype, file, macAddress,
            locationIp,
            deviceId
        });
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}