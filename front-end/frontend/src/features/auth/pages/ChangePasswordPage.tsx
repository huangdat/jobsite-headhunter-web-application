import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import type { ChangePasswordFormData } from "../types";
import { changePassword } from "../services/authApi";
import { toast } from "sonner";

export function ChangePasswordPage() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange =
    (field: keyof ChangePasswordFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (
      formData.newPassword.length < 8 ||
      formData.newPassword.length > 16
    ) {
      newErrors.newPassword = "Password must be between 8 and 16 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password can only contain letters, numbers, and underscores";
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(formData);

      // Success notification
      toast.success("Password changed successfully!");

      // Clear form
      handleCancel();
    } catch (error: unknown) {
      let errorMessage = "Failed to change password. Please try again.";

      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response as {
          status?: number;
          data?: { message?: string };
        };
        errorMessage = response.data?.message || errorMessage;

        // Check if it's current password error
        if (
          response.status === 401 ||
          errorMessage.toLowerCase().includes("current password") ||
          errorMessage.toLowerCase().includes("incorrect password")
        ) {
          setErrors({
            currentPassword: errorMessage,
          });
        }
      }

      // Error notification
      toast.error(errorMessage);

      if (!errors.currentPassword) {
        setErrors({
          currentPassword: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;
  const isFormValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    !hasErrors;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col border-r border-white/10 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-slate-900">
            <span className="material-symbols-outlined font-bold">
              account_tree
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            JobSite
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-brand-primary">
              dashboard
            </span>
            <span className="font-medium">Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-brand-primary">
              work
            </span>
            <span className="font-medium">Jobs</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-brand-primary">
              group_add
            </span>
            <span className="font-medium">Referrals</span>
          </a>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Account
          </div>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary transition-colors border border-brand-primary/20"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 border border-brand-primary/30 bg-cover bg-center"></div>
            <div className="grow overflow-hidden">
              <p className="text-sm font-semibold truncate">Alex Nguyen</p>
              <p className="text-xs text-white/50 truncate">
                alex.n@referral.io
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Settings</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 font-medium">
              Security & Password
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 w-full py-12 px-12">
          <div className="w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Change Password
              </h1>
              <p className="text-slate-500 max-w-3xl">
                Update your password to keep your referral account secure. Use
                at least 8 characters with a mix of letters and numbers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <FormField
                  label="Current Password"
                  error={errors.currentPassword}
                >
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleChange("currentPassword")(e.target.value)
                    }
                    error={!!errors.currentPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.current
                          ? "visibility"
                          : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField label="New Password" error={errors.newPassword}>
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword")(e.target.value)
                    }
                    error={!!errors.newPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.new ? "visibility" : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <FormField
                  label="Confirm New Password"
                  error={errors.confirmPassword}
                >
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword")(e.target.value)
                    }
                    error={!!errors.confirmPassword}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="material-symbols-outlined text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords.confirm
                          ? "visibility"
                          : "visibility_off"}
                      </button>
                    }
                  />
                </FormField>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`flex-1 h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      isFormValid && !isLoading
                        ? "bg-brand-primary text-slate-900 hover:bg-brand-hover"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-12 bg-transparent text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Password Requirements */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 h-fit max-w-md">
                <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">
                  Password Requirements
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>At least 8 characters long</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>
                      Must include at least one uppercase and one lowercase
                      letter
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-brand-primary text-xl">
                      check_circle
                    </span>
                    <span>
                      Include at least one number or special character (@, #, $,
                      etc.)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
