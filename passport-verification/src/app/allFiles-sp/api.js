import { postFileRequest, postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (
  applicationId,
  type,
  remarks,
  mobile,
  reverified = 0
) => {
  try {
    const use_details = await fetch("https://ipinfo.io/json");
    const user_details_json = await use_details.json();
    const locationIp = user_details_json?.ip || "-";
    return await postRequest("application/updateEnquiryStatus", {
      ApplicationID: applicationId,
      locationIp: locationIp,
      macAddress: "-",
      deviceId: "-",
      StatusID:
        reverified == 1 && type == "approve"
          ? "110"
          : type == "approve"
          ? "80"
          : "60",
      StatusText: type == "approve" ? "SP APPROVED" : "SP NOT APPROVE",
      Remarks: remarks,
      mobile,
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

export const showDistrict = async () => {
  try {
    return await postRequest("master/showDistrict", {});
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPoliceStationsByDsId = async (districtId) => {
  try {
    return await postRequest("master/getPoliceStationsByDsId", {
      districtId: districtId,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const transferapplication = async ({
  fileNumber,
  locationIp,
  deviceId,
  remarks,
  districtId,
  psId,
  macAddress,
}) => {
  try {
    console.log("apitest", fileNumber);
    console.log("apitest", districtId);
    console.log("apitest", psId);
    const use_details = await fetch("https://ipinfo.io/json");
    const user_details_json = await use_details.json();
    const locationIp = user_details_json?.ip || "-";
    return await postRequest("sp/transferapplication", {
      applicationId: fileNumber,
      locationIp: locationIp,
      deviceId: "-",
      remarks: remarks,
      districtId: districtId,
      psId: psId,
      macAddress: "-",
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
