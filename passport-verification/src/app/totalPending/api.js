import { postRequest } from "../commonAPI";

export const getApplicationStatus = async () => {
  try {

    return await postRequest("user/getApplicationStatus", {
        "status_id": "0",
        "periord_id": "7"
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};