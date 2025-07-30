import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomTextField from '../../../mui/CustomTextField'
import  apiClient  from '../../../api/apiClient'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

const handleRequestOTP = async () => {
  setIsLoading(true);
  try {
    const response = await apiClient.post("/auth/request-password-reset", { email });
    if (!response.ok) {
      throw new Error("Failed to request OTP");
    }
    toast.success("OTP sent successfully");
    
    // Navigate to verify OTP page with email state
    navigate("/auth/verify-otp", { state: { email } });
  } catch (error) {
    toast.error("Failed to request OTP");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="flex flex-col gap-y-1 justify-center items-center">
        <h2 className="text-[30px] lg:text-[40px] font-semibold">
          Reset Password
        </h2>
      
      </div>

      <div className="rounded-xl w-full max-w-[500px] flex flex-col gap-y-4 p-4">
        <CustomTextField
          label={
            <span className="flex items-center gap-1">Enter Email</span>
          }
          fullWidth
          name="email"
          placeholder="Enter Your Work Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
    
        {/* DROPDOWN REMOVED AS PER YOUR INSTRUCTIONS */}

        <div className="bg-primary text-white flex justify-center items-center font-semibold text-[16px] rounded-xl mt-4">
          <button 
            className="py-2 px-4" 
            onClick={handleRequestOTP}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Request OTP"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword;