import cron from "node-cron";
import { autoOCApprovallUpdate } from "./models/cronJobModel.js";

const callAutoApproval = async () => {
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
    const response = await autoOCApprovallUpdate();
    console.log(response);
    if (response == 0) {
      console.log("autoOCApprovallUpdate executed successfully");
    } else {
      console.log("autoOCApprovallUpdate failed");
    }
  } catch (error) {
    console.error("Error executing autoOCApprovallUpdate:", error);
  }
};

// callAutoApproval();

// Schedule the task to run at 09:00 AM every day
cron.schedule(
//   "* * * * *", // every 1 mint.
    "0 9 * * *",
  async () => {
    callAutoApproval();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
