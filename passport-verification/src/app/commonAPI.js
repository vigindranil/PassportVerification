import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const postRequest = async (url, request_body = {}) => {
  try {
    const authToken = Cookies.load("data");

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

    if (response?.status === 401) {
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/session-expired";
    } else if (!response.ok) {
      throw new Error(response);
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
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

    if (response?.status === 401) {
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/session-expired";
    } else if (!response.ok) {
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/";
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
    Cookies.remove("data");
    Cookies.remove("type");
    Cookies.remove("name");
    Cookies.remove("ps");
    Cookies.remove("district");
    Cookies.remove("ds_id");
    window.location.href = "/";
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
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/session-expired";
    } else if (!response.ok) {
      throw new Error(response);
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
    throw error; // Propagate error to the caller
  }
};

export const postFileRequest = async (url, request_body) => {
  try {
    const authToken = Cookies.load("data");
    const formData = new FormData();

    for (const key in request_body) {
      formData.append(key, request_body[key]);
    }

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
      Cookies.remove("data");
      Cookies.remove("type");
      Cookies.remove("name");
      Cookies.remove("ps");
      Cookies.remove("district");
      Cookies.remove("ds_id");
      window.location.href = "/session-expired";
    } else if (!response.ok) {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    } else {
      const result = await response.json(); // Assuming the API returns JSON
      return result;
    }
  } catch (error) {
    console.log(error.message);
    console.log(error);
    
    throw error; // Propagate error to the caller
  }
};
