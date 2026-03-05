import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, FormField } from "@/shared/ui";
import type { LoginFormData } from "../types";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AnimatedCheckbox } from "../components/AnimatedCheckbox";

import {
  MdOutlineMail,
  MdLockOutline,
  MdOutlineHandshake,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowRight } from "react-icons/hi";

export function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  const handleChange =
    (field: keyof LoginFormData) => (value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#39FF14] p-1.5 rounded-lg">
            <MdOutlineHandshake className="text-black text-lg" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Job<span className="text-lime-500">Site</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="#" className="text-sm font-medium  transition-colors">
            Home
          </Link>

          <Link
            to="/select-role"
            className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* LOGIN SECTION */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-[#071e16] to-[#001f13] text-white p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              Find Talent. <br />
              Earn Rewards.
            </h1>

            <p className="text-gray-300 mt-6">
              Join JobSite’s professional referral network and connect great
              talent with top companies.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

            <p className="text-gray-500 mb-8">
              Enter your credentials to access your account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <FormField label="Work Email" error={errors.email}>
                <Input
                  icon={<MdOutlineMail />}
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email")(e.target.value)}
                />
              </FormField>

              {/* PASSWORD */}
              <FormField label="Password" error={errors.password}>
                <Input
                  icon={<MdLockOutline />}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password")(e.target.value)}
                  rightIcon={
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  }
                />
              </FormField>

              {/* REMEMBER */}
              <div className="flex justify-between items-center text-sm mt-4">
                <AnimatedCheckbox
                  checked={formData.rememberMe ?? false}
                  onChange={(value: boolean) =>
                    handleChange("rememberMe")(value)
                  }
                  label="Remember me"
                />

                <Link to="/forgot-password" className="text-lime-500">
                  Forgot password?
                </Link>
              </div>

              {/* SIGN IN */}
              <Button
                type="submit"
                className="w-full flex justify-center gap-2 cursor-pointer"
              >
                <HiOutlineArrowRight />
                Sign In
              </Button>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-sm text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* SOCIAL LOGIN */}
              <div className="grid grid-cols-2 gap-4">
                {/* GOOGLE */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition cursor-pointer"
                >
                  <FcGoogle size={20} />
                  Google
                </button>

                {/* LINKEDIN */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition cursor-pointer"
                >
                  <FaLinkedin className="text-[#0077B5]" size={20} />
                  LinkedIn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-center pb-8">
        <p className="text-xs text-slate-400">
          © 2024 JobSite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
