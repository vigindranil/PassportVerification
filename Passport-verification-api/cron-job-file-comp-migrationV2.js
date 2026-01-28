import moment from "moment";
import { migrateGzipImagesByKeys } from "./controllers/s3FileMigrationController.js";
import { getDocumentDetailspathToCompress } from "./models/cronJobModel.js";
import cron from "node-cron";


const migrateFiles = async () => {
    // keys fetched from DB
    const date = moment(new Date()).format("YYYY-MM-DD");
    console.log("date", date);
    const response = await getDocumentDetailspathToCompress(date, date, 100); // this will return a array
    console.log("response", response);
    const keys = response.map((item) => item.DocumentPath);

    // await migrateGzipImagesByKeys(response);
    console.log("keys", keys);

}

migrateFiles();

// cron.schedule(
//     // "* * * * *", // every 1 mint.
//     "0 1 * * *",
//     async () => {
//         migrateFiles();
//     },
//     {
//         timezone: "Asia/Kolkata",
//     }
// );
