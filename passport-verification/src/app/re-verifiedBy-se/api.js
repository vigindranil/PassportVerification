import { postFileRequest, postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (applicationId, type, remarks) => {
  try {
    const use_details = await fetch("https://ipinfo.io/json");
    const user_details_json = await use_details.json();
    const locationIp = user_details_json?.ip || "-";
  
    return await postRequest("application/updateEnquiryStatus", {
      ApplicationID: applicationId,
      locationIp: locationIp,
      macAddress: "-",
      deviceId: "-",
      StatusID: "80",
      StatusText: type == "approve" ? "SP APPROVED" : "SP NOT APPROVE",
      Remarks: remarks,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getSpecialEnquiryOfficers = async () => {
  try {
    return await postRequest("enquiryOfficers/getSpecialEnquiryOfficers");
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getApplicationStatus = async () => {
  try {
    return await postRequest("enquiryOfficers/getApplicationStatus");
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const assignApplication = async ({
  applicationId,
  assignTo,
  macAddress,
  locationIp,
  deviceId,
}) => {
  try {
    return await postRequest("enquiryOfficers/assignApplication", {
      applicationId,
      assignTo,
      macAddress,
      locationIp,
      deviceId,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
