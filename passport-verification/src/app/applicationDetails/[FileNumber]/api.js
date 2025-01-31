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

export const getWBSEDCLDetails = async (consumerId, installationNum) => {
  try {
    return await postRequest("third-party/getWBSEDCLDetails", {
      consumerId: "113000079",
      installationNum: "4450",
      ApplicationId: "CA2075989000010",
      DocumentID: "2",
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const getBirthCertificateDetails = async (
  CertificateNo,
  dateofbirth
) => {
  try {
    return await postRequest("third-party/getBirthCertificateDetails", {
      CertificateNo: "B/2024/0937915",
      dateofbirth: "11/07/2024",
    });
  } catch (error) {
    console.log("Error saving user:", error);
    return null;
  }
};

export const verifyApplication = async (
  APITypeId,
  APIName,
  ApplicationId,
  DocumentID,
  APIRequest,
  APIResponse,
  Remarks
) => {
  try {
    return await postRequest("application/verifyApplication", {
      APITypeId,
      APIName,
      ApplicationId,
      DocumentID,
      APIRequest,
      APIResponse,
      Remarks,
    });
  } catch (error) {
    return error.message;
  }
};
