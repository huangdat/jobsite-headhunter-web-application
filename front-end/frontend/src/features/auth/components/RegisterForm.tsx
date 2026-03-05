import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui";
import type { UserRole } from "../types";

import { CandidateRegister } from "./CandidateRegister";
import { CollaboratorRegister } from "./CollaboratorRegister";
import { HeadhunterRegister } from "./HeadhunterRegister";

import { MdOutlineHandshake } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";

interface RegisterFormProps {
  role?: string;
}

const getRoleConfig = (role: UserRole) => {
  const configs = {
    candidate: {
      title: "Create Candidate Account",
      subtitle: "Start your career journey with top companies.",
    },
    collaborator: {
      title: "Create Collaborator Account",
      subtitle: "Refer top talent and earn commission.",
    },
    headhunter: {
      title: "Create Headhunter Account",
      subtitle: "Join our professional recruitment network.",
    },
  };

  return configs[role];
};

export function RegisterForm({ role = "candidate" }: RegisterFormProps) {
  const userRole = role as UserRole;
  const config = getRoleConfig(userRole);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    taxCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", { ...formData, role: userRole });
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
          <Link to="#" className="text-sm font-medium">
            Home
          </Link>

          <Link
            to="/login"
            className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* REGISTER SECTION */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl min-h-[500px] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-[#071e16] to-[#001f13] text-white p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              Join Our <br />
              <span className="text-lime-400">Professional</span> <br />
              Network
            </h1>

            <p className="text-gray-300 mt-1">
              Create your account and start earning opportunities today.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold">{config.title}</h2>

            <p className="text-gray-500 mb-3">{config.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {userRole === "candidate" && (
                <CandidateRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {userRole === "collaborator" && (
                <CollaboratorRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {userRole === "headhunter" && (
                <HeadhunterRegister
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              <Button
                type="submit"
                className="w-full flex justify-center gap-2 cursor-pointer"
              >
                <HiOutlineArrowRight />
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-lime-500 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-8 text-center pb-8">
        <p className="text-xs text-slate-400">
          © 2024 JobSite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
