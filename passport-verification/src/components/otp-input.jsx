"use client"

import React, { useState, useRef, useEffect } from "react"

export function OTPInput({ onComplete }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.nextElementSibling instanceof HTMLInputElement && element.value !== "") {
      element.nextElementSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      onComplete(otp.join(""))
    }
  }, [otp, onComplete])

  return (
    <div className="flex justify-between gap-2">
      {otp.map((data, index) => {
        return (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-12 h-12 text-center text-2xl bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      })}
    </div>
  )
}

