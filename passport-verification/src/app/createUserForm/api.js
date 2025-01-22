import { postRequest } from "../commonAPI";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const saveUser = async (userData) => {
  try {
    return await postRequest("user/saveUser", { userData });
  } catch (error) {
    console.error("Error saving user:", error);
    return null;
  }
};
