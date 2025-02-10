'use client'
import React from "react"
import { Button } from "@/components/ui/button"
import { TriangleAlert } from "lucide-react"
import Link from "next/link"

const Unauthorize = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <TriangleAlert className="text-xl mx-auto my-2 text-yellow-600" />
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Unauthorize</h1>
        <p className="text-gray-600 mb-6 text-justify">
          You are not authorized to access this page. Please log in again to continue.
        </p>
        <Link href='/login' className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Login Again
        </Link>
      </div>
    </div>
  )
}

export default Unauthorize

