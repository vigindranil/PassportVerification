import { postRequest } from "@/app/commonAPI";

export const getDetailsApplicationId = async (applicationId) => {
  try {
    return await postRequest("application/detailsapplicationId", {
      applicationId: applicationId,
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const getWBSEDCLDetails = async (applicationId) => {
  try {
    return await postRequest("third-party/getWBSEDCLDetails", {
      consumerId: "113000079",
      installationNum: "4450",
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};
