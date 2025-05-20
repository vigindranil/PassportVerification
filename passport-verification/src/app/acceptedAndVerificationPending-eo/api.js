import { postRequest } from "../commonAPI";

export const updateEnquiryStatus = async (
  applicationId,
  remarks,
  type = "approve"
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
      StatusID: type == "approve" ? "10" : type == "reject" ? "10" : "50",
      StatusText:
        type == "approve" ? "Recommended by EO" : type == "reject" ? "Not Recommended by EO" : "Forwarded to SP",
      Remarks: remarks,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
