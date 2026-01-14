import pkg from "ftp";
// import path from "path";
// import mime from "mime-types";
const Client = pkg;
// import { Client } from "basic-ftp";
// import { Writable } from "stream";
// import { Client as Client2 } from "ssh2";

// const FTP_CONFIG_STAGING = {
//   host: "115.187.62.16",
//   port: 21,
//   user: "apacheftp",
//   password: "Vyoma@9836700645#",
// };

const FTP_CONFIG_STAGING = {
  host: "localhost",
  port: 21,
  user: "ubuntu",
  password: "Wb$dc@123",
};

export async function uploadToFTP(fileBuffer, remoteFileName) {
  return new Promise((resolve, reject) => {
    const client = new Client();
    client.on("ready", () => {
      const remoteFilePath = `/var/www/html/uploads/${remoteFileName}`;
      client.put(fileBuffer, remoteFilePath, (err) => {
        console.log(fileBuffer, remoteFilePath);
        if (err) {
          console.error("FTP Upload Error:", err);
          reject(null);
        } else {
          console.log("File successfully uploaded:", remoteFilePath);
          resolve(remoteFileName);
        }
        client.end();
      });
    });
    client.on("error", (err) => {
      console.error("FTP Connection Error:", err);
      reject(null);
    });
    client.connect(FTP_CONFIG_STAGING);
  });
}
