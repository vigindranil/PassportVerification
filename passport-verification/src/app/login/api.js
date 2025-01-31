import Cookies from "react-cookies";
import { encrypt } from "../../utils/crypto";
import { postRequest } from "../commonAPI";

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
      return false;
    }
    const data = await response.json();
    Cookies.save("data", data.token);
    Cookies.save("name", data.name);
    Cookies.save("type", data.type);
    Cookies.save("ps", data.ps);
    Cookies.save("district", data.district);
    console.log("data", data);
    return true;

  } catch (error) {
    console.log("Error sending OTP:", error);
    return false;
  }
};

export const verifyOtp = async (otp) => {
  try {
    return await postRequest("auth/verifyOtp", { otp });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

