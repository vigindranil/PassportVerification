'use client'
import React, { useEffect } from 'react'
import Cookies from "react-cookies";
import { logout } from '../commonAPI';

const page = () => {

  useEffect(() => {
    const userSignOut = async () => {
      try {
        await logout();
      } catch (error) {
        Cookies.remove("data");
        Cookies.remove("type");
        Cookies.remove("name");
        Cookies.remove("ps");
        Cookies.remove("district");
        console.log("Error saving user:", error);
        window.location.href = "/";
      }
    };

    userSignOut();
  }, []);

  return (
    <div>
      Loading...
    </div>
  )
}

export default page
