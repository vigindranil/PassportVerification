"use client"

import Image from "next/image"
import LoginForm from "@/components/login-form"
import BackgroundImage from "@/assets/newBcak.webp"
import Logo from "@/assets/wbplogo.png"

export default function LoginPage() {
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Image src={BackgroundImage || "/placeholder.svg"} alt="Background" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true" />
      <div className="relative bg-white/30 backdrop-blur-md rounded-lg p-2 shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src={Logo || "/placeholder.svg"}
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

