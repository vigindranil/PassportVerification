import { postRequestThirdParty } from "../../commonAPI";

export const getWBSEDCLDetailsApi = async (consumerId, installationNum) => {
  try {

    return await postRequestThirdParty("third-party/v2/getWBSEDCLDetails", {
      consumerId, installationNum
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

