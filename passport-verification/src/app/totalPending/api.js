import { postRequest } from "../commonAPI";

export const getApplicationStatus = async (status, period) => {
  try {

    return await postRequest("user/getApplicationStatus", {
        "status_id": status,
        "periord_id": period
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const revokeEnquiryStatus = async (applicationId, type, remarks) => {
  try {
      const macAddress = "-";
      const locationIp = "-";
      const deviceId = "-";
      return await postRequest("application/updateEnquiryStatus", {
          "ApplicationID": applicationId,
          "locationIp": "115.187.62.100",
          "macAddress": "test-s4dn-3aos-dn338",
          "deviceId": "123#df",
          "StatusID": "0",
          "StatusText": type == 'revoke' ? 'DYSP Revoke' : 'DYSP NOT Revoke',
          "Remarks": remarks
      });
  } catch (error) {
      console.log("Error:", error);
      return null;
  }
}