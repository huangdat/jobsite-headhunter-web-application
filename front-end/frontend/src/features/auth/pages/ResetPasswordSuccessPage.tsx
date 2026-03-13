import { Link } from "react-router-dom";
import { AuthLayout } from "@/shared/components";

export function ResetPasswordSuccessPage() {
  return (
    <AuthLayout ctaButton={{ to: "/login", label: "Sign In" }}>
      <main className="max-w-5xl mx-auto px-4 pt-12">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-dark-panel-from to-dark-panel-to p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-brand-primary text-3xl">
                  security
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Account <br />
                <span className="text-brand-primary">Secured</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                Your password has been successfully updated. We recommend
                keeping your credentials secure and never sharing them with
                anyone.
              </p>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-400">
                    check_circle
                  </span>
                  <span className="text-sm text-slate-300">
                    Password Updated Successfully
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand-primary">
                    shield
                  </span>
                  <span className="text-sm text-slate-300">
                    Your Account is Protected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Success Message */}
          <div className="md:w-7/12 p-8 md:p-14 bg-white dark:bg-slate-900 flex items-center">
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-brand-primary success-icon-glow">
                    check_circle
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Password Changed!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
                Your password has been updated successfully. You can now log in
                with your new credentials.
              </p>
              <Link
                to="/login"
                className="success-button-gradient w-full py-4 text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 mb-8"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
