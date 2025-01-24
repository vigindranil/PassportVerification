import xlsx from "xlsx";
import { saveApplicationDetailsModel } from "../models/insertFileModel.js";
import moment from "moment/moment.js";

// Function to trim JSON keys and values
const trimJsonData = (data) => {
  return data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key?.trim(),
        key?.trim() == "Date of Birth" ||
        key?.trim() == "PV Initiation Date" ||
        key?.trim() == "PV Status Date"
          ? moment(value?.trim(), "DD-MMM-YYYY", true).format("YYYY/MM/DD")
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

    res.status(200).json({
      status: 0,
      message: `${jsonData.length} record(s) have been parsed successfully`,
      data: jsonData
    });
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
    let failure_arr = [];
    let success_arr = [];
    let duplicate_arr = [];

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
        failure_error += 1;
        failure_arr.push(element["File Number"]);
      } else if (result == 2) {
        duplicate_error += 1;
        duplicate_arr.push(element["File Number"]);
      } else if (result == 0) {
        success_arr.push(element["File Number"]);
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      status: 0,
      message: `${success_arr.length} record(s) have been added`,
      data: {
        added: success_arr,
        duplicate: duplicate_arr,
        failed: failure_arr,
      }
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ status: 1, message: "Error processing file", data: null });
  }
};

