"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTPInput } from "@/components/otp-input"
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { sendOtp, verifyOtp } from "@/app/login/api"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loadingOtpSend, setLoadingOtpSend] = useState(false)
  const [loadingOtpVerify, setLoadingOtpVerify] = useState(false)
  const [error, setError] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("") 
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setError("")
    setLoadingOtpSend(true)

    try {
      const response = await sendOtp(username, password)
      console.log("sendOtp", response)
      setMessage(`OTP sent successfully`)
      setShowOtp(true)
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoadingOtpSend(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError("")
    setLoadingOtpVerify(true)

    try {
      const response = await verifyOtp(otp)
      console.log("response", response);
      
      if (response.status == 0) {
        router.push("/dashboard")
      }else {
        setError(response.message)
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoadingOtpVerify(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 bg-white/20 text-white placeholder-gray-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 bg-white/20 text-white placeholder-gray-300"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button onClick={() => handleSubmit()} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loadingOtpSend}>
          {loadingOtpSend ? "Processing..." : "Send OTP"}
        </Button>
      </div>

      {showOtp && (
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-white">Enter 6-digit OTP</Label>
            <OTPInput onComplete={(completedOtp) => setOtp(completedOtp)} />
          </div>
          <Button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loadingOtpVerify}>
            {loadingOtpVerify ? "Verifying..." : "Verify OTP"}
          </Button>
          {loadingOtpVerify && <p className="text-center text-blue-300">Verifying OTP...</p>}
        </div>
      )}

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
    </div>
  )
}

export default LoginForm