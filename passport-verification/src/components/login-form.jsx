"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OTPInput } from "@/components/otp-input"
import { User, Lock, Eye, EyeOff, RotateCcw, LoaderCircle } from 'lucide-react'
import { sendOtp, verifyOtp } from "@/app/login/api"
import { useToast } from "../hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loadingOtpSend, setLoadingOtpSend] = useState(false)
  const [loadingOtpVerify, setLoadingOtpVerify] = useState(false)
  const [loadingResendOtp, setLoadingResendOtp] = useState(false)
  const [error, setError] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState(null)
  const [resendTimer, setResendTimer] = useState(60);
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOtp = async () => {
    
    setError("")
    setLoadingOtpSend(true)
    try {
      const response = await sendOtp(username, password)
      console.log("sendOtp", response)
      
      if(response){
        toast({
          title: "OTP sent successfully",
          description: "A six digit code was sent to your aadhaar linked phone number",
          action: (
            <ToastAction altText="close">Close</ToastAction>
          ),
        })
        setShowOtp(true)
      }else {
        setMessage(`Failed to send OTP, Please try again`)
        setShowOtp(true)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
      toast({
        variant: "destructive",
        title: "Failed to Send OTP!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
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

      router.push("/dashboard")
      if (response.status == 0) {
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoadingOtpVerify(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setLoadingResendOtp(true)

    try {
      const response = await sendOtp(username, password)
      setMessage(`OTP sent successfully`)
      if(response){
        setShowOtp(true)
        setResendTimer(60);
        toast({
          title: "OTP sent successfully",
          description: "A six digit code was sent to your aadhaar linked phone number",
          action: (
            <ToastAction altText="close">Close</ToastAction>
          ),
        })
      }else {
        setMessage(`Failed to resend otp, Please try again`)
      }
    } catch (error) {
      setMessage(`Failed to resend otp`)
      toast({
        variant: "destructive",
        title: "Failed to Send OTP!",
        description: "Something went wrong, Please try again",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setLoadingResendOtp(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Timer for resend OTP
  useEffect(() => {
    if (showOtp) {
      const timer = setInterval(() => {
        if (resendTimer > 0) {
          setResendTimer(resendTimer - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtp, resendTimer]);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-white/20">

      {!showOtp && (
        <><h2 className="text-2xl font-bold text-center mb-6 text-slate-600">Login</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-500">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-white/20 text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-500">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-white/20 text-gray-700 placeholder-gray-300"
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
            <Button onClick={() => handleSendOtp()} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loadingOtpSend}>
              {loadingOtpSend ? <>Logging in <LoaderCircle className="animate-spin"/></> : "Login"}
            </Button>
          </div>
        </>
      )}

      {showOtp && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-600">Verify OTP</h2>
          <span className="text-sm text-slate-500">
            A six digit secret code has been sent to your aadhaar linked phone number.
          </span>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-white">Enter 6-digit OTP</Label>
              <OTPInput onComplete={(completedOtp) => setOtp(completedOtp)} />
            </div>
            <Button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loadingOtpVerify}>
              {loadingOtpVerify ? <>Verifying <LoaderCircle className="animate-spin"/></> : "Verify OTP"}
            </Button>
            <Button onClick={handleResend} className={`w-full text-white ${resendTimer === 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-500"
              }`} disabled={resendTimer === 0 ? false : true}>
              {loadingResendOtp ? <>Loading <LoaderCircle className="animate-spin"/></> : <><RotateCcw /> Resend OTP</>} {resendTimer !== 0 && `after ${resendTimer} seconds`}
            </Button>

          </div>
        </>
      )}

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
    </div>
  )
}

export default LoginForm