import xlsx from "xlsx";
import { saveApplicationDetailsModel } from "../models/insertFileModel.js";
import moment from "moment/moment.js";
import logger from "../utils/logger.js";

// Function to trim JSON keys and values
const trimJsonData = (data) => {
  const allowedKeys = new Set([
    "Sr. No.",
    "DPHq ID/Name",
    "Police Station",
    "File Number",
    "PV Request ID",
    "Applicant Name",
    "Gender",
    "Date of Birth",
    "Place of Birth",
    "Spouse Name",
    "Father's Name",
    "PV Initiation Date",
    "PV Request Status",
    "PV Status Date",
    "Verification Address",
    "Permanent Address",
    "PV Sequence No.",
    "E-mail ID",
    "Phone No.",
  ]);

  for (const row of data) {
    // If any key in row is not in allowedKeys, return []
    if (Object.keys(row).some((key) => !allowedKeys.has(key.trim()))) {
      return [];
    }
  }

  // If all keys are valid, process and return data
  return data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key.trim(),
        ["Date of Birth", "PV Initiation Date", "PV Status Date"].includes(
          key.trim()
        )
          ? moment(value?.trim(), "DD-MMM-YYYY").format("YYYY-MM-DD")
          : value,
      ])
    )
  );
};

export const convertExcelToJson = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({status: 1, message: "No file uploaded", data: null });
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Trim JSON keys and values
    const jsonData = trimJsonData(data);    

    if(jsonData?.length > 0) {
      res.status(200).json({
        status: 0,
        message: `${jsonData.length} record(s) have been converted successfully`,
        data: jsonData
      });
    }else {
      res.status(200).json({status: 1, message: "Invalid excel format, Please check the correct format before importing", data: []});
    }

  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ status: 1, message: "Error processing file", data: null });
  }
};

export const uploadExcel = async (req, res) => {
  try {
    const { jsonData } = req.body;

    let failure_error = 0;
    let duplicate_error = 0;
    let ps_error = 0;
    let failure_arr = [];
    let success_arr = [];
    let duplicate_arr = [];
    let ps_arr = [];

    const promises = jsonData.map(async (element) => {
      const result = await saveApplicationDetailsModel(
        element["DPHq ID/Name"],
        element["Police Station"],
        element["File Number"],
        element["PV Request ID"],
        element["Applicant Name"],
        element["Gender"],
        element["Date of Birth"],
        element["Place of Birth"],
        element["Spouse Name"],
        element["Father's Name"],
        element["PV Initiation Date"],
        element["PV Request Status"],
        element["PV Status Date"],
        element["Verification Address"],
        element["Permanent Address"],
        element["PV Sequence No."],
        element["E-mail ID"],
        element["Phone No."],
        req?.user?.UserID || null
      );

      if (result == 1) {
        console.log("error code 1", element["File Number"]);
        failure_error += 1;
        failure_arr.push(element["File Number"]);
      } else if (result == 2) {
        console.log("error code 2", element["File Number"]);
        duplicate_error += 1;
        duplicate_arr.push(element["File Number"]);
      } else if (result == 3) {
        console.log("error code 3", element["File Number"]);
        ps_error += 1;
        ps_arr.push(element["File Number"]);
      } else if (result == 0) {
        
        console.log("error code 0", element["File Number"]);
        
        success_arr.push(element["File Number"]);
      }
    });

    await Promise.all(promises);

    console.log("json", jsonData?.length)

    logger.debug(
      JSON.stringify({
        API: "verifyOtp",
        REQUEST: { jsonData },
        RESPONSE: {
          added: success_arr,
          duplicate: duplicate_arr,
          failed: [...failure_arr, ...ps_arr],
        },
      })
    );

    res.status(200).json({
      status: 0,
      message: `${success_arr?.length} record(s) have been added`,
      data: {
        added: success_arr,
        duplicate: duplicate_arr,
        failed: [...failure_arr, ...ps_arr],
      }
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ status: 1, message: "Error processing file", data: null });
  }
};

