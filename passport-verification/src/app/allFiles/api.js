import { postFileRequest, postRequest } from "../commonAPI";

export const acceptApplication = async (applicationId, citizentype, file) => {
  try {
    // fetch get call https://ipinfo.io/json
    const use_details = await fetch("https://ipinfo.io/json");
    const user_details_json = await use_details.json();

    const user_agent = {
      ip: user_details_json?.ip,
      hostname: user_details_json?.hostname,
      city: user_details_json?.city,
      region: user_details_json?.region,
      country: user_details_json?.country,
      loc: user_details_json?.loc,
      org: user_details_json?.org,
      postal: user_details_json?.postal,
      timezone: user_details_json?.timezone,
    };
    const jsonTEXT = JSON.stringify(user_agent);
    const locationIp = user_details_json?.ip;
    const deviceId = "-";
    const macAddress = "-";
    return await postFileRequest("upload/acceptCaseUploadDocument", {
      applicationId,
      citizentype,
      jsonTEXT,
      file,
      macAddress,
      locationIp,
      deviceId,
    });
  } catch (error) {
    console.log("Error:", error);
    return error.message;
  }
};

export const getRequiredDocuments = async (citizenTypeId, dateOfBirth) => {
  try {
    return await postRequest("documents/get-required-documents", {
      citizenTypeId,
      dateOfBirth
    });
  } catch (error) {
    return [];
  }
};
