import moment from "moment";
import { postRequestThirdParty } from "../../commonAPI";

export const getBirthCertificateDetailsApi = async (CertificateNo, dateofbirth) => {
  try {
    const date = moment(dateofbirth).format("DD/MM/YYYY");

    return await postRequestThirdParty("third-party/v2/getBirthCertificateDetails", {
      CertificateNo, dateofbirth: date
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

