'use client'
import React, { useEffect } from 'react'
import Cookies from "react-cookies";
import { logout } from '../commonAPI';
import { Loader2 } from 'lucide-react';

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
        window.location.href = "/login";
      }
    };

    userSignOut();
  }, []);

  return (
    <div className='h-screen w-screen bg-slate-200/50 flex flex-col justify-center items-center text-center'>
      <Loader2 size={30} className='animate-spin text-blue-500'/>
      <h1 className='text-xl font-bold text-gray-600 text-center mx-auto'>Logging Out...</h1>
    </div>
  )
}

export default page
