import { postRequest } from "../commonAPI";

export const updatePassword = async (user_id=null, old_passWord, new_password) => {
  try {

    return await postRequest("user/updatePassword", {
      user_id, old_passWord, new_password
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

