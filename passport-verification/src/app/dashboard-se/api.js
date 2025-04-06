import { postRequest } from "../commonAPI";



export const getDistrictNodalDashBoard = async () => {
  try {

    return await postRequest("user/getApplicationCountsV1");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
export const getCountSE = async () => {
  try {

    return await postRequest("enquiryOfficers/getCountSE");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
