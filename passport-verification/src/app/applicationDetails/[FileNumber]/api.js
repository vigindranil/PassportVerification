import { getRequest, postRequest } from "@/app/commonAPI";

export const getDetailsApplicationId = async (applicationId, ActiveStatusId = 1) => {
  try {
    return await postRequest("application/detailsapplicationId", {
      applicationId: applicationId,
      ActiveStatusId: ActiveStatusId,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getMadhyamikCertificate = async (roll, number, year) => {
  try {
    return await postRequest("third-party/getMadhyamikCertificate", {
      roll: roll,
      number: number,
      examYear: year,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getLandDeedDetails = async (mouzaCode, khatianNo) => {
  try {
    return await postRequest("third-party/getLandDeedDetails", {
      MouzaCode: mouzaCode,
      KhatianNo: khatianNo,
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
      name_accused: data?.name_accused || "",
      criminal_aliases_name: data?.criminal_aliases_name || "",
      address: data?.address || "",
      father_accused: data?.father_accused || "",
      age_accused: data?.age_accused || "",
      from_date: data?.from_date || "",
      to_date: data?.to_date || "",
      case_yr: data?.case_yr || "",
      policestations: data?.policestations || "",
      pageno: data?.pageno || 1
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const updateCriminalInfoApi = async (payload) => {
  try {
    return await postRequest("crime/updateCriminalInfo", payload);
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPCCApplicationDetails = async (applicant_name, applicant_aadhaar) => {
  try {
    return await postRequest("third-party/getPCCApplicationDetails", {
      // applicant_name: "Tanmay",
      // applicant_aadhaar: "6806",
      applicant_name: applicant_name,
      applicant_aadhaar: applicant_aadhaar,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPCCApplicationDetailsV2 = async (applicant_name, applicant_aadhaar) => {
  try {
    return await postRequest("third-party/getPCCApplicationDetailsV2", {
      // applicant_name: "Tanmay",
      // applicant_aadhaar: "6806",
      name: applicant_name,
      contact_no: applicant_aadhaar,
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const restoreFile = async (
  document_id,
  file_name
) => {
  try {
    return await postRequest("s3-upload/restoreFile", {
      document_id,
      file_name
    });
  } catch (error) {
    return error.message;
  }
};

export const getPrivateFilePreview = async (file_name) => {
  try {
    return await getRequest(
      "s3-download/getPrivateFilePreview?FILE_KEY=" + file_name
    );
  } catch (error) {
    return error.message;
  }
};
