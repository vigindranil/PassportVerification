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