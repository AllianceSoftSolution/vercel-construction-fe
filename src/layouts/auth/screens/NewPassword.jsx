import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import CustomTextField from '../../../mui/CustomTextField'
import apiClient from '../../../api/apiClient'
import { toast } from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const location = useLocation();

    useEffect(() => {
        // Get email from navigation state
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect back to reset password
            navigate("/auth/reset-password");
        }
    }, [location.state, navigate]);

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) {
            errors.push("8+ characters");
        }
        if (!hasUpperCase) {
            errors.push("1 capital letter");
        }
        if (!hasLowerCase) {
            errors.push("1 lowercase letter");
        }
        if (!hasNumbers) {
            errors.push("1 number");
        }
        if (!hasSpecialChar) {
            errors.push("1 special character");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSetNewPassword = async () => {
        // Validate passwords
        if (!newPassword || !confirmNewPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Enhanced password validation
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            toast.error(`Password requirements: ${passwordValidation.errors.join(", ")}`);
            return;
        }

        if (!token) {
            toast.error("Invalid reset token");
            navigate("/auth/reset-password");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post(`/auth/reset-password/${token}`, { 
                email,
                newPassword 
            });
            
            if (!response.ok) {
                const errorMessage = response.data?.message || "Failed to reset password";
                throw new Error(errorMessage);
            }
            
            toast.success("Password reset successfully! You can now login with your new password.");
            
            // Clear form data
            setNewPassword("");
            setConfirmNewPassword("");
            
            // Navigate to login page
            navigate("/auth/login");
        } catch (error) {
            console.error("Password reset error:", error);
            const errorMessage = error.message || "Failed to reset password. Please try again.";
            toast.error(errorMessage);
            
            // If token is invalid, redirect to reset password
            if (error.message?.includes("invalid") || error.message?.includes("expired")) {
                setTimeout(() => {
                    navigate("/auth/reset-password");
                }, 2000);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSetNewPassword();
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center px-4 py-4">
            <div className="w-full max-w-sm mx-auto">
                <div className="flex flex-col justify-center items-center mb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-black">
                        Set New Password
                    </h2>
                 
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-y-3">
                        {/* New Password Field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Password requirements */}
                        {newPassword && (
                            <div className="text-xs">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-700">Password strength:</span>
                                    <span className={`font-medium ${validatePassword(newPassword).isValid ? 'text-green-600' : 'text-red-500'}`}>
                                        {validatePassword(newPassword).isValid ? 'Strong' : 'Weak'}
                                    </span>
                                </div>
                                {!validatePassword(newPassword).isValid && (
                                    <div className="text-red-500 text-xs">
                                        {validatePassword(newPassword).errors.join(', ')}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all duration-200" 
                            onClick={handleSetNewPassword}
                            disabled={isLoading || !newPassword || !confirmNewPassword || !validatePassword(newPassword).isValid}
                        >
                            {isLoading ? "Setting Password..." : "Set New Password"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPassword;