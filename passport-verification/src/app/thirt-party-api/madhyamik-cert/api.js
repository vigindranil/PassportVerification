import { postRequestThirdParty } from "../../commonAPI";

export const getMadhyamikCertificateApi = async (roll, number, examYear) => {
  try {

    return await postRequestThirdParty("third-party/v2/getMadhyamikCertificate", { roll, number, examYear });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

