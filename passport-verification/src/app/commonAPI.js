import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postRequest = async (url, request_body) => {
  try {
    const authToken = Cookies.load("data");
    console.log("authToken", authToken);
    
    const HEADERS = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "POST",
      headers: new Headers(HEADERS),
      body: JSON.stringify(request_body),
      redirect: "follow",
    };

    const response = await fetch(`${BASE_URL}${url}`, requestOptions);
    console.log(response);

    if (response?.status === 401) {
      window.location.href = '/session-expired';
    } else if (!response.ok) {
      throw new Error(response);
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error; // Propagate error to the caller
  }
};

export const getRequest = async (url) => {
  try {
    const authToken = Cookies.load("data");

    const HEADERS = {
      Authorization: `Bearer ${authToken}`,
    };

    const requestOptions = {
      headers: new Headers(HEADERS),
      redirect: "follow",
    };

    const response = await fetch(`${BASE_URL}${url}`, requestOptions);

    if (response.status === 401) {
      window.location.href = '/session-expired';
    } else if (!response.ok) {
      throw new Error(response);
    }else{ 
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error; // Propagate error to the caller
  }
};
