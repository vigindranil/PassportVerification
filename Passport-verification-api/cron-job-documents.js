import cron from "node-cron";
import { getDocumentdoneBySP, updateDocumentarchiveStatus } from "./models/cronJobModel.js";
import moment from "moment/moment.js";
import { archiveSPApprovedFileToGlacier } from "./controllers/eoController.js";

const archiveDocumentToGlacier = async () => {
  const nowInKolkata = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  console.log("🕒 Time in Asia/Kolkata:", nowInKolkata);
  try {
    const date = moment(new Date()).format("YYYY-MM-DD");
    // const date = "2025-08-09";
    console.log("date", date);
    
    const response = await getDocumentdoneBySP(date, date); // this will return a array

    if(response?.length){
      for await (const document of response) {
        const file_key = document?.DocumentPath?.split('https://wb-passport-verify.s3.ap-south-1.amazonaws.com/')[1];
        if(!file_key) continue
        const doc_id = await archiveSPApprovedFileToGlacier(document);
        if(!doc_id) continue
        const response = await updateDocumentarchiveStatus(doc_id);
      }
    }
    return;
  } catch (error) {
    console.error("Error executing autoOCApprovallUpdate:", error);
  }
};

// archiveDocumentToGlacier();

// Schedule the task to run at 09:00 AM every day
cron.schedule(
  // "* * * * *", // every 1 mint.
  "0 23 * * *",
  async () => {
    archiveDocumentToGlacier();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
