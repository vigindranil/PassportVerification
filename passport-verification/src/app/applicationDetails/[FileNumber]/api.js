import { postRequest } from "@/app/commonAPI";

export const getDetailsApplicationId = async (applicationId) => {
  try {

    return await postRequest("application/detailsapplicationId", {
        "applicationId" : applicationId
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
