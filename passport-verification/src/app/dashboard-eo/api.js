import { postRequest } from "../commonAPI";



export const getCountEO = async () => {
  try {

    return await postRequest("eo/getCountEO");
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
