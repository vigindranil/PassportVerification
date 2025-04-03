import { postRequest } from "../commonAPI";

export const getApplicationStatus = async (status, period) => {
  try {

    return await postRequest("user/getApplicationStatus", {
        "status_id": status,
        "periord_id": period || 0
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const revokeEnquiryStatus = async (applicationId, type, remarks) => {
  try {
    const use_details = await fetch("https://ipinfo.io/json");
    const user_details_json = await use_details.json();
    const locationIp = user_details_json?.ip || "-";
      return await postRequest("application/updateEnquiryStatus", {
          "ApplicationID": applicationId,
          "locationIp": locationIp,
          "macAddress": "-",
          "deviceId": "-",
          "StatusID": "0",
          "StatusText": 'Application Revoked',
          "Remarks": remarks
      });
  } catch (error) {
      console.log("Error:", error);
      return null;
  }
}