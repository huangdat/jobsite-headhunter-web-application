import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui";
import type { UserRole } from "../types";

import {
  MdOutlineHandshake,
  MdPersonSearch,
  MdGroups,
  MdWorkHistory,
} from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";

interface RoleOption {
  value: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "candidate",
    icon: <MdPersonSearch />,
    title: "Candidate",
    description: "Looking for my next career opportunity",
  },
  {
    value: "collaborator",
    icon: <MdGroups />,
    title: "Collaborator",
    description: "Referring top talent and earning rewards",
  },
  {
    value: "headhunter",
    icon: <MdWorkHistory />,
    title: "Headhunter",
    description: "Professional recruiter managing multiple roles",
  },
];

export function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      navigate(`/register/${selectedRole}`);
    }
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
            Job<span className="text-[#39FF14]">Site</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="#" className="text-sm font-medium transition-colors">
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

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-[#071e16] to-[#001f13] text-white p-10 flex flex-col justify-center">
            <h1 className="text-5xl font-bold leading-tight">
              Choose Your <br />
              <span className="text-lime-400">Role</span>
            </h1>

            <p className="text-gray-300 mt-6">
              Select how you want to participate in our platform.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">Join JobSite</h2>

            <p className="text-gray-500 mb-8">
              Select your role to start creating your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all
                  ${
                    selectedRole === option.value
                      ? "border-[#39FF14] bg-[#39FF14]/10"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    className="hidden"
                    checked={selectedRole === option.value}
                    onClick={() =>
                      setSelectedRole(
                        selectedRole === option.value ? null : option.value,
                      )
                    }
                  />

                  <div className="text-2xl text-slate-700">{option.icon}</div>

                  <div>
                    <h3 className="font-semibold text-lg">{option.title}</h3>
                    <p className="text-sm text-slate-500">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={!selectedRole}
                className={`w-full flex justify-center gap-2 mt-6 
                ${selectedRole ? "cursor-pointer" : " opacity-60"}`}
              >
                Continue
                <HiOutlineArrowRight />
              </Button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-lime-500 font-medium">
                  Sign In
                </Link>
              </p>
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
