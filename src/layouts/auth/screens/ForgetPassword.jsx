import React from "react";
// import navLogo from "@/assets/nursing/nav-logo.png";

function Login() {
    return (
        <div className="md:min-h-screen flex items-center justify-center bg-white px-2">
            <div className="w-full  ">
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        // src={navLogo} // Replace with your actual logo path
                        alt="Nurse Insight Logo"
                        className="w-32"
                    />
                </div>

                {/* Heading */}
                <h2 className="text-center text-lg font-medium mt-4">
                    Welcome to the <span className="font-bold text-[#0A1F5F]">Nursing Insight</span> Platform
                </h2>

                {/* Form */}

                <p className=" md:mt-12 mt-3 text-lg font-bold text-center">Reset Password</p>

                <div className="mt-6">
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Example@email.com"
                            className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
                        />
                    </div>




                    <button
                        type="submit"
                        className="w-full bg-[#0A1F5F] text-white py-2 rounded-md hover:bg-[#08194A] transition"
                    >
                        Send Reset Email
                    </button>
                </div>


            </div>
        </div>
    );
}

export default Login;
