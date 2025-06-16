import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
// import navLogo from "@/assets/nursing/nav-logo.png";
import { Link } from "react-router-dom";

// ✅ Zod Schema for validation
const schema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    phone: z.string().length(11, "Phone number must be 11 digits"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["ADM", "USR"], "Role is required"),
    program_type: z.enum(["LVN", "RN"], "Program type is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    toast.loading("Signing up...");

    try {
      const response = await apiClient.post("/auth/register", {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        role: data.role,
        program_type: data.program_type,
      });

      if (response.ok) {
        toast.dismiss();
        toast.success("Account created successfully!");
        navigate("/auth/login");
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen flex items-center justify-center w-full bg-white px-4">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={navLogo} alt="Nurse Insight Logo" className="w-32" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-lg font-medium mt-4">
          Welcome to the{" "}
          <span className="font-bold text-[#0A1F5F]">Nursing Insight</span>{" "}
          Platform
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Name Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                First Name
              </label>
              <input
                {...register("first_name")}
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">
                {errors.first_name?.message}
              </p>
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                Last Name
              </label>
              <input
                {...register("last_name")}
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">
                {errors.last_name?.message}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">{errors.phone?.message}</p>
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input
                {...register("email")}
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">{errors.email?.message}</p>
            </div>
          </div>

          {/* Password Fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">{errors.password?.message}</p>
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Type here"
                className="w-full px-4 py-2 bg-[#f7fbff] border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A1F5F]"
              />
              <p className="text-red-500 text-xs">
                {errors.confirmPassword?.message}
              </p>
            </div>
          </div>

          {/* Role & Program Type */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">Role</label>
              <select
                {...register("role")}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Role</option>
                <option value="ADM">Admin</option>
                <option value="USR">User</option>
              </select>
              <p className="text-red-500 text-xs">{errors.role?.message}</p>
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-600 text-sm mb-1">
                Program Type
              </label>
              <select
                {...register("program_type")}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Program</option>
                <option value="LVN">LVN</option>
                <option value="RN">RN</option>
              </select>
              <p className="text-red-500 text-xs">
                {errors.program_type?.message}
              </p>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#0A1F5F] text-white py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create an Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
