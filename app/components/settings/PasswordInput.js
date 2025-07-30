"use client"


import { useState, forwardRef } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"


export const PasswordInput = forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="password-input-container">
      <input type={showPassword ? "text" : "password"} className={className} ref={ref} {...props} />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
        {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
      </button>
    </div>
  )
})

PasswordInput.displayName = "PasswordInput"
