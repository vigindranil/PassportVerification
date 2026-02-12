import Cookies from "react-cookies";
import { postRequest } from "@/app/commonAPI";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendOtp = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}auth/sendOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, loginType: 1 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    Cookies.save("data", data.token);
    return data;
  } catch (error) {
    console.log("Error sending OTP:", error);
    return null;
  }
};

export const sendOtpV1 = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}auth/sendOtpV1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, loginType: 1 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error sending OTP:", error);
    return null;
  }
};

export const verifyOtp = async (otp) => {
  try {
    const data = await postRequest("auth/verifyOtp", { otp });
    Cookies.save("data", data.token);
    Cookies.save("name", data.name);
    Cookies.save("type", data.type);
    Cookies.save("ps", data.ps);
    Cookies.save("district", data.district);
    Cookies.save("ds_id", data.DistrictID);
    Cookies.save("__i", 1); // otp verified

    console.log("akash", data?.type);
    if (data.type == 150) {
      
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        username: "IBUSER",
        password: "@IBUSER@123#",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const resp = await fetch(`${BASE_URL}auth/generateSecretToken`, requestOptions);
      const json_data = await resp.json();
      Cookies.save("third_party_tk", json_data?.token);

    }
    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const verifyOtpV1 = async (username, otp) => {
  try {
    const data = await postRequest("auth/verifyOtpV1", { username, otp });
    Cookies.save("data", data.token);
    Cookies.save("name", data.name);
    Cookies.save("type", data.type);
    Cookies.save("ps", data.ps);
    Cookies.save("district", data.district);
    Cookies.save("ds_id", data.DistrictID);
    Cookies.save("__i", 1); // otp verified

    console.log("akash", data?.type);
    if (data.type == 150) {
      
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        username: "IBUSER",
        password: "@IBUSER@123#",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const resp = await fetch(`${BASE_URL}auth/generateSecretToken`, requestOptions);
      const json_data = await resp.json();
      Cookies.save("third_party_tk", json_data?.token);

    }
    return data;
  } catch (error) {
    console.log("Error:", error);
    return error.message;
  }
};
