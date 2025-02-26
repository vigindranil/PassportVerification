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
      StatusID: "10",
      StatusText:
        type == "approve" ? "Recommended by EO" : "Not Recommended by EO",
      Remarks: remarks,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
