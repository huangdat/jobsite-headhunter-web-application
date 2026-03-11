import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/shared/components";
import type { UserRole } from "../types";

import { MdPersonSearch, MdGroups, MdWorkHistory } from "react-icons/md";
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
    <AuthLayout ctaButton={{ to: "/login", label: "Sign In" }}>
      <div className="w-full max-w-5xl min-h-[calc(600px)] bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
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

          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && selectedRole) {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).requestSubmit();
              }
            }}
            className="space-y-4"
          >
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition-all
        ${
          selectedRole === option.value
            ? "border-brand-primary bg-brand-primary/10"
            : "border-slate-200 hover:border-slate-400"
        }`}
              >
                <input
                  type="radio"
                  name="role"
                  className="sr-only"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={() => setSelectedRole(option.value)}
                />

                <div className="text-2xl text-slate-700">{option.icon}</div>

                <div>
                  <h3 className="font-semibold text-lg">{option.title}</h3>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
              </label>
            ))}

            <Button
              variant="primary"
              size="xl"
              type="submit"
              disabled={!selectedRole}
              className={`w-full flex justify-center gap-2 mt-6 
      ${selectedRole ? "cursor-pointer" : "opacity-60"}`}
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
    </AuthLayout>
  );
}
