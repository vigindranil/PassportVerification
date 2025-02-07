import { postRequest } from "@/app/commonAPI";

export const getDetailsApplicationId = async (applicationId) => {
  try {
    return await postRequest("application/detailsapplicationId", {
      applicationId: applicationId,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getWBSEDCLDetails = async (consumerId, installationNum) => {
  try {
    return await postRequest("third-party/getWBSEDCLDetails", {
      consumerId: consumerId,
      installationNum: installationNum,
      ApplicationId: "CA2075989000010",
      DocumentID: "2",
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getBirthCertificateDetails = async (
  CertificateNo,
  dateofbirth
) => {
  try {
    return await postRequest("third-party/getBirthCertificateDetails", {
      CertificateNo: CertificateNo,
      dateofbirth: dateofbirth,
    });
  } catch (error) {
    console.log("Error:", error);
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

export const getPccCrimeDetails = async (fname, lname) => {
  try {
    return await postRequest("third-party/getPCCCrimeRecordSearch", {
      fname: fname,
      lname: lname,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getKolkataPoliceCriminalRecordSearchv4 = async (data) => {
  try {
    return await postRequest("third-party/getKolkataPoliceCriminalRecordSearchv4", {
      name_accused: data.name_accused,
      criminal_aliases_name: data.name_accused,
      address: data.name_accused,
      father_accused: data.name_accused,
      age_accused: data.name_accused,
      from_date: data.name_accused,
      to_date: data.name_accused,
      case_yr: data.name_accused,
      policestations: data.name_accused,
      pageno: data.name_accused
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};