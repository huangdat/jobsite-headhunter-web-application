import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui";
import type { UserRole } from "../types";

interface RoleOption {
  value: UserRole;
  icon: string;
  title: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "candidate",
    icon: "person_search",
    title: "Candidate",
    description: "Looking for my next career opportunity",
  },
  {
    value: "collaborator",
    icon: "groups",
    title: "Collaborator",
    description: "Referring top talent and earning rewards",
  },
  {
    value: "headhunter",
    icon: "work_history",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#39FF14] p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white text-xl block">
              hub
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            JobSite
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">
            Step 1 of 3
          </span>
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-[#39FF14]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-4 md:p-6 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-5xl shadow-2xl overflow-hidden min-h-[calc(750px)] border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="relative bg-linear-to-br from-[#0a0f0d] to-[#111827] p-10 lg:p-16 flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex p-3 bg-slate-800/50 rounded-2xl mb-8">
                <span className="material-symbols-outlined text-[#39FF14]">
                  rocket_launch
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Unlock Your <br />
                <span className="text-[#39FF14] italic">Earning</span> <br />
                Potential
              </h1>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-12">
                Join our ecosystem where opportunities meet expertise. Whether
                you're seeking a career, referring talent, or hunting heads, we
                have the platform for you.
              </p>

              {/* Community Badge */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm relative mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaNqSJ0RgiP_SLdo05inmIzbXZmoiOljbdbkoZSHKrOeRUhgvf1vuqTVddE_swihTS4O6Rczx4Bp3SKR7V7_3hTbd18_El7wClWVy6zKThT4ATebbmARxucYBxJ-guck9zEtAw1XjbdyWYZW2BWkrWA7InD8kHkY0Ej-s-a9U19hYpMR1dxd27gN9efnJIBZg-9skYp5adzo_9yW71CSeCaOn0Uw-ho5NqnsFI-H6bdTUMEc83mg0VEhxau9VqCh8Cah6l44ydH84"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_01-k3LUWkKYPRMe0wSmfysrivR1fTPbKzWVFPsjE-5-d0TPaArcmQeUtjd_XYDO6W4ZnJoxKb4zIlvKYkmBUZeh72rPUKLfwVhxmJwU9_wOujILxLk_qzAn_na-hRbIR96DD0Of-LbYtcxl8Yjicak8JQxoHLafhoOisQGxPMADqjB_15fibx8NK2VQVCzMx5W1Re1lMLHkVvWakgAYmYDy-3zdR6zIBBxWNHvaQhz3YXw_-NAbVkOyxo8wrNMiHD4YhSUewpSU"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6LiJJ0S9miV9cg0e6VgSCRI5oqZfi0k-BFawEvXzh01o1db5aNkndllOEvwKGUCbM3Iz6MrheOX-5EfwUL8WyT1xxuEZQOHRNIRiSMKx-zOBUoItJPltaUaHfTp0LDJJ36-Ki3Gdo7qRkpCnKtCsDwFvaC5xwNNB5Ihl_V_hLDXLkD6G0QXwZBwENdrme0Id_FDMQkYTa7Rwbw5sqSLyu4hJO2nErkOK_AAfirMBM9UhVj9GYs4NtmbyetT5AXmt8GYQM7wP8Iqk"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-[#39FF14] flex items-center justify-center text-[10px] font-bold text-slate-900 uppercase">
                      +12k
                    </div>
                  </div>
                  <span className="text-slate-300 text-sm font-medium">
                    Over 12,000 active professionals
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video relative group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXprL1txm-jWSCycjR6HZPYZqArIFm59fgKiYQNsceclbGxybQrHmUL_05W5b4zw5aNW1b5BG4yHpeFsBkG-jHHLe5rccGL1shG8cl2WWP5-jGVmqSctpWrBjG_MZGtT0VjwR_o0SbUqYFZtweR6hUsLoT9pWFsjtL5_-cKZuW9pj07bRnYBEC52lNAL2IF2RswXt06xjf1wSz-KIvVD0es0MqT4s50Pz1qXU1IEQRXoHTfkiOpi3_UBoUOC_Fh2n4UJ3nLIxUgro"
                    alt="Community interaction"
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="material-symbols-outlined text-[#39FF14] text-xl">
                  verified
                </span>
                <span className="text-sm font-medium">
                  Curated Professional Ecosystem
                </span>
              </div>
            </div>

            {/* Background blur effects */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#39FF14]/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#39FF14]/5 blur-[100px] rounded-full"></div>
          </div>

          {/* Right Panel */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Join our community
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Select your primary role to customize your experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className="cursor-pointer group relative"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={selectedRole === option.value}
                      onChange={() => setSelectedRole(option.value)}
                      className="sr-only peer"
                    />
                    <div
                      className={`flex items-center p-6 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl transition-all ${
                        selectedRole === option.value
                          ? "border-[#39FF14] bg-[#39FF14]/5"
                          : "border-transparent"
                      }`}
                    >
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mr-6 transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-3xl text-slate-600 dark:text-slate-300">
                          {option.icon}
                        </span>
                      </div>
                      <div className="grow">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#39FF14] transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {option.description}
                        </p>
                      </div>
                      {selectedRole === option.value && (
                        <div className="w-6 h-6 bg-[#39FF14] rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-base font-bold">
                            check
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={!selectedRole}
                  className="transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Continue
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#39FF14] font-bold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-6">
          <Link to="#" className="hover:text-[#39FF14] transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-[#39FF14] transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-[#39FF14] transition-colors">
            Support
          </Link>
        </div>
        <p>© 2024 ReferralPortal Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
