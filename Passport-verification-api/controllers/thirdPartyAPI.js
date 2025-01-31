import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import crypto from 'crypto';
import {
  savethirdpartyVerifyStatus,
  setExternelApiLog,
} from "../models/applicationModel.js";
dotenv.config();

export const generateOtpAadhaar = async (aadhaar_number, user_id) => {
  try {
    const url = "https://api.gridlines.io/aadhaar-api/boson/generate-otp";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
      "X-Auth-Type": "API-Key",
    };

    const body = JSON.stringify({
      aadhaar_number: aadhaar_number,
      consent: "Y",
      user_id: user_id,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
      timeout: 0, // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
    });

    console.log("api aadhaar response: ", response);
    const transactionId = response.headers.get("x-transaction-id");
    console.log("api aadhaar transactionId: " + transactionId);

    if (response.ok) {
      return transactionId;
    } else {
      return transactionId;
    }
  } catch (error) {
    console.log("Error generating OTP: ", error);
    return false;
  }
};

export const verifyOtpAadhaar = async (otp, user_id, transaction_id) => {
  try {
    const url = "https://api.gridlines.io/aadhaar-api/boson/submit-otp";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": "0ZU5MIiP9neGxEhpxLZCpBrmDk087jw0",
      "X-Auth-Type": "API-Key",
      "X-Transaction-ID": transaction_id,
    };

    const body = JSON.stringify({
      otp: otp,
      include_xml: true,
      share_code: "1001",
      user_id: user_id,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
      timeout: 0, // Node-fetch does not have a built-in timeout option; you can handle it separately if needed
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

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
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};

export const getWBSEDCLDetails = async (req, res) => {
  const { consumerId, installationNum} = req.body;

  if (!consumerId) {
    return res.status(400).json({ error: "ConsumerId is required." });
  } else if (!installationNum) {
    return res.status(400).json({ error: "InstallationNum is required." });
  }

  let data = JSON.stringify({
    consumerId: consumerId,
    installationNum: installationNum,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://portaltest.wbsedcl.in/WBSEDCLPASSPORTENQUIRYWS/FetchBasicConsumerDetails",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      console.log("response", response);
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: response?.data,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        status: 0,
        message: "Failed to fetched details",
        data: null,
      });
    });
};
