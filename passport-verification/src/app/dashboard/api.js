import { postRequest } from "../commonAPI";



export const getDistrictNodalDashBoard = async () => {
  try {

    return await postRequest("user/getDistrictNodalDashBoard");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
