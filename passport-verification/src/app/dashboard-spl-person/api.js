import { postRequest } from "../commonAPI";



export const getStateDashBoard = async () => {
  try {

    return await postRequest("stateadmin/getDashboardCountStateMasterAdmin");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};


