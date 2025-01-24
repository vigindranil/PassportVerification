import { postFileRequest, postRequest } from "../commonAPI";

export const convertExcelToJson = async (file) => {
  try {
    return await postFileRequest("fileImport/convertExcelToJson", { file });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export const uploadExcel = async (jsonData) => {
  try {
    return await postRequest("fileUpload/uploadExcel", { jsonData });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

