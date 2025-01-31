'use client'
import React from "react"
import { Button } from "@/components/ui/button"
import { TriangleAlert } from "lucide-react"

const SessionExpired = () => {
  const handleLogin = () => {
    // Redirect to login page
    window.location.href = "/login"
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <TriangleAlert className="text-xl mx-auto my-2 text-yellow-600"/>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Session Expired</h1>
        <p className="text-gray-600 mb-6">
          Your session has expired due to inactivity. Please log in again to continue.
        </p>
        <Button onClick={handleLogin} className="w-full">
          Log In Again
        </Button>
      </div>
    </div>
  )
}

export default SessionExpired

