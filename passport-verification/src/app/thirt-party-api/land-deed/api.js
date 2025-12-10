import { postRequestThirdParty } from "../../commonAPI";

export const getLandDeedDetailsApi = async (MouzaCode, KhatianNo) => {
  try {

    return await postRequestThirdParty("third-party/v2/getLandDeedDetails", {
      MouzaCode, KhatianNo
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

