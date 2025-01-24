import { postFileRequest } from "../commonAPI";

export const uploadExcel = async (file) => {
  try {
    return await postFileRequest("fileImport/importExcel", { file });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

