import App from "next/app";
import { postRequest } from "../commonAPI";

export const getApplicationStatusByFileNumber = async (applicationId) => {
  try {
    return await postRequest("stateAdmin/applicationStatusByFileNumber", {
      ApplicationId: applicationId,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};



