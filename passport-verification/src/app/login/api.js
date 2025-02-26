import Cookies from "react-cookies";
import { postRequest } from "@/app/commonAPI";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const sendOtp = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}auth/sendOtp`,
      {
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
    const response = await fetch(`${BASE_URL}auth/sendOtpV1`,
      {
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
    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export const verifyOtpV1 = async (otp) => {
  try {
    const data = await postRequest("auth/verifyOtpV1", { otp });
    Cookies.save("data", data.token);
    Cookies.save("name", data.name);
    Cookies.save("type", data.type);
    Cookies.save("ps", data.ps);
    Cookies.save("district", data.district);
    Cookies.save("ds_id", data.DistrictID);
    Cookies.save("__i", 1); // otp verified
    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

