import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postRequest = async (url, request_body) => {
  try {
    const authToken = Cookies.load("data");
    console.log();
    
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

export const logout = async () => {
  try {
    const authToken = Cookies.load("data");
    const HEADERS = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "POST",
      headers: new Headers(HEADERS),
      body: JSON.stringify({}), // Empty body for logout request
      redirect: "follow",
    };

    const response = await fetch(`${BASE_URL}user/logout`, requestOptions);
    console.log(response);

    if (response?.status === 401) {
      window.location.href = '/session-expired';
    } else if (!response.ok) {
      return null;
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
    console.log(error);
    return result;
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

export const postFileRequest = async (url, request_body) => {
  try {
    const authToken = Cookies.load("data");
    const formData = new FormData();
    formData.append('file', request_body.file);
    
    const HEADERS = {
      Authorization: `Bearer ${authToken}`,
    };

    const requestOptions = {
      method: "POST",
      headers: new Headers(HEADERS),
      body: formData,
      redirect: "follow",
    };

    const response = await fetch(`${BASE_URL}${url}`, requestOptions);
    

    if (response?.status === 401) {
      window.location.href = '/session-expired';
    } else if (!response.ok) {
      throw new Error(response);
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      console.log(result);
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error; // Propagate error to the caller
  }
};