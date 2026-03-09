import { Link } from "react-router-dom";
import { AuthLayout } from "@/shared/components";

export function ResetPasswordSuccessPage() {
  return (
    <AuthLayout
      navLinks={[
        { to: "#", label: "Home" },
        { to: "#", label: "How it works" },
        { to: "#", label: "Rewards" },
      ]}
      ctaButton={{ to: "/select-role", label: "Sign Up" }}
      showFooter={false}
    >
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-slate-100 dark:border-slate-800">
          {/* Left Panel */}
          <div className="md:w-5/12 bg-linear-to-br from-[#0A1F16] to-[#050D0A] p-12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none radial-dot-pattern"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <span className="material-symbols-outlined text-brand-primary">
                  trending_up
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Unlock Your <br />
                <span className="text-brand-primary">Earning Potential</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-12">
                Join our exclusive network of professional headhunters. Refer
                top talent and earn competitive rewards for every successful
                placement.
              </p>

              {/* Social Proof Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuABqlsvx6yZKfSnftA9Q2pU5FhkX-HgGSa6Y6gVX5288goI_6QfB28E5atvv4bVqoAoQmoZojZljsD9E-HnURxRo7pS0LpBO_yFrwErsmK6onRJe-E3tSnQYYk81Ni3ja9E8nek5sfQMgLqPvdWAM382R9VaDGxq7Bx6xsPQ3GRaMk0sokF5beAUhEIN1u6sFA4h9qryLo0tTIBI3MvSBU9A22TQW0WE35Fi5HkNMmEah7DOW0P2gGwknoSVbh8DH1D-jyJvLCWp4Y"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrGFYjfvCx9VTzgFbISWHa4x-dovk2yi6zo-HX_XPSiqq9dZ-8zjK0hqJdzg3mkd_8XVKnNgjSg1M5grdNyd45T3m7nKo6OzXhBQ2nJ0sGgf34CThoRvsdbcFjVg7cScFUXE9MvPlOc_X4tFaumfcJ8jsaSEc0aa1Cq8StK3_ly0HR0sL7L2iXr88de_9EZmpbG_52aKSghBVFGVqWYYvrfbz7-_qS4NBlZFa60-efifFVfNfUMWkue1ZP0EhOX6iMG1Zfct2ViEA"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9v813yZs4c_n_9ftsSu_SxqHicYHC-Wp8xd361akoojexbr4IWjAwGvEYL6JOyICXevf_xRMAAEGMa6mw47JM8WLUGgDD0_qZrbfSOAGTVneGA4ZBMojk4ZpwmZv-3tjQubCKfflANEsaIpThvkJ7EydfLSWW3eoz6LN5WLEuKp6llJkfM67PyAZ6QVTpyR3Zh-6e9UlDs3mbYkGKecaUKG5L67aBg11_HqgDfI40siFxxO9lM4tpW0ESKE4vy5myXbonTnEGnAU"
                      alt="Active user"
                      className="w-10 h-10 rounded-full border-2 border-slate-800"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold">
                      +5k
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    Join 5,000+ Professionals
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz_qmyk466XBK6tnSpzCfNeX1MGRUor1hkZ5YNJtfB-1DtZNr0-2QSWKDHAsWjXLJ8LCLxc0wJiRaVYSgio1IIExn-eCkTLqxgTm1Ked8Zke4BEL-RMq_i0rtCYLBWriZd0JbJ7zks9e_NJzm_fqATytYOs-mUm2joMW5jC0D7Ee064Q0npbzhvtPuGfQMBqigNYsFgQhSDZgLvPvNv37J9FtQIKOdCfvvs2fFHbH8nZxu0nhdVLAAdUHU4a-wx0ybAs69JAR06lk"
                    alt="Professional meeting"
                    className="w-full h-full object-cover grayscale brightness-75"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-500 text-xl">
                  stars
                </span>
                <span className="text-sm font-medium text-slate-300">
                  Platinum Tier Rewards
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-primary text-xl">
                  verified_user
                </span>
                <span className="text-sm font-medium text-slate-300">
                  Verified Professional Network
                </span>
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
              <p className="text-sm text-slate-500">
                Need help?{" "}
                <Link
                  to="#"
                  className="text-brand-primary font-bold hover:underline"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </footer>
      </main>
    </AuthLayout>
  );
}
