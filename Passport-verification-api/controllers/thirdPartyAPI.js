import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import crypto from "crypto";
import {
  getApplicationStatusBetweenDaterangeModel,
  savethirdpartyVerifyStatus,
  setExternelApiLog,
} from "../models/applicationModel.js";
import qs from "qs";
import { saveCriminalStatusLog } from "../models/logModel.js";
dotenv.config();

export const generateOtpAadhaar = async (aadhaar_number, user_id) => {
  let data = JSON.stringify({
    aadhaar_number: aadhaar_number,
    consent: "Y",
    user_id: user_id,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.gridlines.io/aadhaar-api/boson/generate-otp",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
      "X-Auth-Type": "API-Key",
    },
    data: data,
  };

  try {
    const result = await axios.request(config);
    // console.log("response", result?.data);
    return result?.data;
  } catch (error) {
    if (error?.response) {
      // console.log(error?.response?.data); // Logs only the response data
      return error?.response?.data;
    } else {
      return null;
    }
  }
};

export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
  let data = JSON.stringify({
    otp: otp,
    include_xml: true,
    share_code: "1001",
    user_id: user_id,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.gridlines.io/aadhaar-api/boson/submit-otp",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
      "X-Auth-Type": "API-Key",
      "X-Transaction-ID": transaction_id,
    },
    data: data,
  };

  try {
    const result = await axios.request(config);
    // console.log("response", result?.data);
    return result?.data;
  } catch (error) {
    if (error?.response) {
      // console.log(error?.response?.data); // Logs only the response data
      return error?.response?.data;
    } else {
      return null;
    }
  }
};

// export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
//   try {
//     const url = "https://api.gridlines.io/aadhaar-api/boson/submit-otp";
//     const headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
//       "X-Auth-Type": "API-Key",
//       "X-Transaction-ID": transaction_id,
//     };

//     const body = JSON.stringify({
//       otp: otp,
//       include_xml: true,
//       share_code: "1001",
//       user_id: user_id,
//     });

//     const response = await fetch(url, {
//       method: "POST",
//       headers: headers,
//       body: body,
//       timeout: 0, // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
//     });

//     if (response.ok) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

export const getBirthCertificateDetails = async (req, res) => {
  const { CertificateNo, dateofbirth } = req.body;

  if (!CertificateNo) {
    return res.status(400).json({ error: "Certificate No. is required." });
  } else if (!dateofbirth) {
    return res.status(400).json({ error: "Date of birth is required." });
  }

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://janma-mrityutathya.wb.gov.in/api/GetBirthCertificate?CertificateNo=${CertificateNo}&dateofbirth=${dateofbirth}`,
    auth: {
      username: "WbPoliceDept",
      password: "475754de-d82b-57578g-aed9-4a476567619f9",
    },
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
  };

  axios
    .request(config)
    .then((response) => {
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      // console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

export const getLandDeedDetails = async (req, res) => {
  const { MouzaCode, KhatianNo } = req.body;
  if (!MouzaCode) {
    return res.status(400).json({ error: "Mouza Code(IDN) is required." });
  } else if (!KhatianNo) {
    return res.status(400).json({ error: "Khatian No is required." });
  }

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://banglarbhumi.gov.in/NizamWebservice/service/CellLandOwnerdetail/${MouzaCode}/${KhatianNo}/0/17/RGxycyMxMjM=Ukd4eWN6RXlNMU5VUmc9PQ==`,
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
  };

  axios
    .request(config)
    .then(async (response) => {
      // console.log("response", response);
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      // console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

export const getWBSEDCLDetails = async (req, res) => {
  const { consumerId, installationNum } = req.body;

  if (!consumerId) {
    return res.status(400).json({ error: "ConsumerId is required." });
  } else if (!installationNum) {
    return res.status(400).json({ error: "InstallationNum is required." });
  }

  let data = JSON.stringify({
    userId: "ppUser",
    password: "ppPassword@123",
    consumerId: consumerId,
    installationNum: installationNum,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://portal.wbsedcl.in/WBSEDCLPASSPORTENQUIRYWS/FetchBasicConsumerDetails",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      // console.log("response", response);
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      // console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

// Kolkata police records
export const getKolkataPoliceCriminalRecordSearchv4 = async (req, res) => {
  const {
    name_accused,
    criminal_aliases_name,
    address,
    father_accused,
    age_accused,
    from_date,
    to_date,
    case_yr,
    policestations,
    pageno,
  } = req.body;

  const isLogSaved = await saveCriminalStatusLog(
    "Kolkata police records",
    `${name_accused || ""}-${criminal_aliases_name || ""}`,
    req?.user?.UserID
  );

  // if(isLogSaved == 0){

  // }

  // Create FormData instance
  let formData = new FormData();
  formData.append("name_accused", name_accused || "");
  formData.append("criminal_aliases_name", criminal_aliases_name || "");
  formData.append("address", address || "");
  formData.append("father_accused", father_accused || "");
  formData.append("age_accused", age_accused || "");
  formData.append("from_date", from_date || "");
  formData.append("to_date", to_date || "");
  formData.append("case_yr", case_yr || "");
  formData.append("policestations", policestations || "");
  formData.append("pageno", pageno || "");
  formData.append("identitycategory", "");
  formData.append("crimecategory", "");
  formData.append("moduslist", "");
  formData.append("brief_keyword", "");
  formData.append("class", "");
  formData.append("subclass", "");
  formData.append("user_id", "");
  formData.append("own_jurisdiction", "");

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.kolkatapolice.org/crimebabuapp/Api/criminalSearchv4",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  axios
    .request(config)
    .then(async (response) => {
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      // console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

// CID criminal records
export const getPCCCrimeRecordSearch = async (req, res) => {
  const { fname, lname } = req.body;

  let data = qs.stringify({
    authToken: "PCC@Pd@26062024",
    fname: fname,
    lname: lname,
  });

  await saveCriminalStatusLog(
    "CID criminal records",
    `${fname || ""} ${lname || ""}`,
    req?.user?.UserID
  );

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://sitrep-cid.wb.gov.in/Api/pccApi",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
  };

  axios
    .request(config)
    .then(async (response) => {
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      // console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

// PCC criminal records
export const getPCCApplicationDetails = async (req, res) => {
  const { applicant_name, applicant_aadhaar } = req.body;

  if (!applicant_name) {
    return res.status(400).json({ error: "Applicant Name is required." });
  } else if (!applicant_aadhaar) {
    return res.status(400).json({ error: "Aadhaar is required." });
  }

  // Create form data
  let formData = new FormData();
  formData.append("ApplicantName", applicant_name);
  formData.append("ApplicantAadhaar", applicant_aadhaar);

  // await saveCriminalStatusLog("PCC criminal records", applicant_name, req?.user?.UserID);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://wbpcb.nltr.org/WBPCCServiceV1/api/GetPassportPCCApplicationDetails",
    data: formData,
    // headers: formData.getHeaders(),
    // httpsAgent: new https.Agent({
    //   secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    // }),
  };

  axios
    .request(config)
    .then((response) => {
      // console.log("response", response.data);
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data?.data[0],
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetch details",
        data: null,
      });
    });
};

export const searchSuspectedPerson = async (req, res) => {
  const { name, contact_no } = req.body;

  if (!contact_no && !name) {
    return res
      .status(400)
      .json({ error: "Please enter Contact number or applicant name." });
  }

  // Prepare FormData exactly like curl
  let formData = new FormData();
  formData.append("Name", name || "");
  formData.append("ContactNo", contact_no);
  formData.append("RequestDomain", "wbpassportverify.link");
  formData.append("RequestUser", "1");

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    // url: "http://115.187.62.16:3700/wbpccservice/api/searchSuspectedPersonInfoByNameAndContactNo",
    url: "https://pcc.wb.gov.in/WBPCCServiceV2/api/searchSuspectedPersonInfoByNameAndContactNo",
    headers: {
      APIToken: "PASS@20112025$!#",
      "Content-Type": "application/json",
    },
    data: formData,
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      rejectUnauthorized: false, // Some servers need this too
    }),
  };

  axios
    .request(config)
    .then((response) => {
      return res.status(200).json({
        status: 1,
        message: "Data fetched successfully",
        data: response.data,
      });
    })
    .catch((error) => {
      console.log("Error :", error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetch details",
        data: null,
      });
    });
};

export const sendSMS = async (req, res) => {
  const { smstext, mobileNumber, smsCategory = "N/A", tpid } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ error: "Mobile Number is required." });
  } else if (!smstext) {
    return res.status(400).json({ error: "Message text is required." });
  }

  const BartaBaseURL = "http://barta.wb.gov.in/send_sms_ites_webel.php?";
  const extra = "";
  const passkey = "sms_webel_ites_5252_@$#";

  try {
    const numbers = encodeURIComponent(mobileNumber);
    const message = encodeURIComponent(smstext);
    const passkeyNew = encodeURIComponent(passkey);

    const url = `${BartaBaseURL}mobile=${numbers}&message=${message}&templateid=${tpid}&extra=${extra}&passkey=${passkeyNew}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      }
    );

    // console.log("SMS Execution:", response);
    return res.status(200).json({
      status: 0,
      message: "SMS sent successfully",
    });
  } catch (error) {
    console.error("Exception:", error.message);
    return res.status(400).json({
      status: 1,
      message: "Exception occurred while sending SMS.",
    });
  }
};

export const sendSMSInternally = async (
  smstext,
  mobileNumber,
  smsCategory = "N/A",
  tpid
) => {
  const BartaBaseURL = "http://barta.wb.gov.in/send_sms_ites_webel.php?";
  const extra = "";
  const passkey = "sms_webel_ites_5252_@$#";

  try {
    const numbers = encodeURIComponent(mobileNumber);
    const message = encodeURIComponent(smstext);
    const passkeyNew = encodeURIComponent(passkey);

    const url = `${BartaBaseURL}mobile=${numbers}&message=${message}&templateid=${tpid}&extra=${extra}&passkey=${passkeyNew}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      }
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.log("Exception:", error.message);
    return false;
  }
};

export const getMadhyamikCertificate = async (req, res) => {
  try {
    const { roll, number, examYear } = req.body; // Extract parameters from body

    if (!roll || !number || !examYear) {
      return res.status(400).json({
        status: 1,
        message: "Roll, Number, and Exam Year are required.",
      });
    }

    // Step 1: Generate Token
    const tokenResponse = await axios.post(
      "https://wbbse.wb.gov.in:8181/api/auth/generate-token",
      { username: "admin", password: "123" },
      {
        headers: { "Content-Type": "application/json" },
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      }
    );

    const token = tokenResponse.data?.token;
    if (!token) {
      return res
        .status(500)
        .json({ status: 1, message: "Failed to generate token" });
    }

    // Step 2: Fetch Madhyamik Certificate Details
    const certificateResponse = await axios.post(
      `https://wbbse.wb.gov.in:8181/api/students/verifyRollNo?roll=${roll}&number=${number}&examYear=${examYear}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        }),
      }
    );

    // console.log("certificateResponse", certificateResponse?.data);

    if (!certificateResponse?.data) {
      return res
        .status(400)
        .json({ status: 1, message: "Certificate not found", data: null });
    }
    return res.status(200).json({
      status: 0,
      message: "Certificate details fetched successfully",
      data: certificateResponse?.data,
    });
  } catch (error) {
    console.error(
      "Error fetching certificate details:",
      error?.message || error
    );
    return res.status(500).json({
      status: 1,
      message: "Certificate not found",
      data: null,
    });
  }
};

export const getApplicationStatusBetweenDaterange = async (req, res) => {
  const { StatusId, StartDate, EndDate, Page, Limit } = req.body;

  try {
    if (!StartDate) {
      return res.status(400).json({
        status: 1,
        message: "Invalid Start Date.",
      });
    } else if (!EndDate) {
      return res.status(400).json({
        status: 1,
        message: "Invalid End Date.",
      });
    } else if (!Limit) {
      return res.status(400).json({
        status: 1,
        message: "Invalid Limit",
      });
    }

    const result = await getApplicationStatusBetweenDaterangeModel(
      StatusId,
      StartDate,
      EndDate,
      Page,
      Limit
    );

    return res.status(200).json({
      status: 0,
      message: "data fetch susccfully",
      total_records: result[0].TotalApplicationCount || 0,
      page_no: Page || 0,
      limit: Limit || 0,
      data: result || [],
    });
  } catch (error) {
    console.error("Error in getcount:", error.message);
    return res.status(500).json({
      status: 1,
      message: "Internal server error",
      error: error.message,
    });
  }
};
