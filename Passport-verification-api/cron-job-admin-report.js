import cron from "node-cron";
import { getApplicationCountallDsistrict } from "./models/cronJobModel.js";

const callCronJob = async () => {
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
    const response = await getApplicationCountallDsistrict();
    console.log(response);
    if (response) {
      console.log("getApplicationCountallDsistrict executed successfully");
    } else {
      console.log("getApplicationCountallDsistrict failed");
    }
  } catch (error) {
    console.error("Error executing getApplicationCountallDsistrict:", error);
  }
};

// callCronJob();

// Schedule the task to run at 09:00 AM every day
cron.schedule(
//   "* * * * *", // every 1 mint.
    "55 23 * * *",
  async () => {
    callCronJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
);
