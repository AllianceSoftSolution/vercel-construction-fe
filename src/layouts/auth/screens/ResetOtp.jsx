import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomTextField from '../../../mui/CustomTextField'
import apiClient from '../../../api/apiClient'
import { toast } from 'react-hot-toast'

const ResetOtp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Get email from navigation state
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect back to reset password
            navigate("/auth/reset-password");
        }
    }, [location.state, navigate]);

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/verify-otp", { 
                email, 
                otp: otpString 
            });
            if (!response.ok) {
                throw new Error("Invalid OTP");
            }
            
            // Extract resetToken from response
            const { resetToken } = response.data;
            if (!resetToken) {
                throw new Error("No reset token received");
            }
            
            toast.success("OTP verified successfully");
            // Navigate to set new password page with resetToken in URL
            navigate(`/auth/new-password/${resetToken}`, { state: { email } });
        } catch (error) {
            toast.error(error.message || "Failed to verify OTP");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center px-4 py-4">
            <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col gap-y-3 justify-center items-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center">
                        Verify OTP
                    </h2>
                    <p className="text-xs sm:text-sm text-center text-gray-600 max-w-sm">
                        Enter the 6-digit code sent to {email}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 mt-3">
                    <div className="flex flex-col gap-y-4">
                        {/* OTP Input Section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 text-center">
                                Enter OTP
                            </label>
                            <div className="flex gap-x-2 sm:gap-x-3 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-8 h-8 sm:w-10 sm:h-10 text-center text-base font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        placeholder=""
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button 
                            className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all duration-200" 
                            onClick={handleVerifyOTP}
                            disabled={isLoading || otp.join("").length !== 6}
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>

                        {/* Try Again Link */}
                        <div className="text-center pt-1">
                            <button 
                                className="text-xs font-medium text-[#BF1017] hover:underline transition-all duration-200"
                                onClick={() => navigate("/auth/reset-password")}
                            >
                                Didn't receive code? Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetOtp;