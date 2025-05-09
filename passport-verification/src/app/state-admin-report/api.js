import { postRequest } from "../commonAPI";

export const getApplicationCountMasterAdmin = async (districtId, start_date, end_date) => {
  try {

    return await postRequest("application/getApplicationCountMasterAdmin", {
        "districtId": districtId,
        "startDate": start_date || null, 
        "endDate": end_date || null
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};


