import { postRequest } from "../commonAPI";

export const getApplicationCountMasterAdmin = async (districtId, start_date, end_date) => {
  try {

    return await postRequest("application/getApplicationCountMasterAdminV1", {
        "districtId": districtId,
        "startDate": start_date || null, 
        "endDate": end_date || null
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
export const getApplicationTimeLine = async (districtId, psId, startdate, enddate) => {
  try {
    return await postRequest("stateAdmin/getApplicationTimeLine", {
      userId: 1,
      districtId: districtId || 1,
      psId: psId || 0,
      startdate: startdate || null,
      enddate: enddate || null
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};



