import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, AuthLayout, SocialLoginButtons } from "@/shared/components";
import { useAuthTranslation } from "@/shared/hooks";
import { AnimatedCheckbox } from "@/features/auth/components/AnimatedCheckbox";
import { useLogin } from "@/features/auth/hooks";
import {
  getSocialConfig,
  googleLogin,
  linkedinLogin,
} from "@/features/auth/services/authApi";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth";
import { extractApiErrorMessage } from "@/features/auth/utils/apiError";
import type { LoginResult, SocialAuthResponse } from "@/features/auth/types";

import { MdAccountCircle, MdLockOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowRight } from "react-icons/hi";

const SOCIAL_STATE_KEY = "socialOAuthState";
const SOCIAL_PROVIDER_KEY = "socialOAuthProvider";

type SocialProvider = "google" | "linkedin";

const isLoginResult = (
  value: LoginResult | SocialAuthResponse
): value is LoginResult => {
  return (
    typeof value === "object" &&
    value !== null &&
    "authenticated" in value &&
    "accessToken" in value
  );
};

const createRandomState = () => {
  return Math.random().toString(36).slice(2, 15);
};

const clearOAuthCallbackParams = () => {
  const nextUrl = `${window.location.pathname}${window.location.search}`;
  const hasHash = window.location.hash.length > 0;

  if (hasHash) {
    window.history.replaceState({}, document.title, nextUrl);
  }
};

export function LoginPage() {
  const { t } = useAuthTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitializing, signIn } = useAuth();
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    handleChange,
    loadRememberedEmail,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );
  const [socialConfig, setSocialConfig] = useState({
    googleClientId: "",
    linkedinClientId: "",
  });

  const hasHandledState = useRef(false);

  const googleEnabled = socialConfig.googleClientId.trim().length > 0;
  const linkedInEnabled = socialConfig.linkedinClientId.trim().length > 0;

  const handleSocialLoginSuccess = useCallback(
    async (result: LoginResult | SocialAuthResponse) => {
      if (isLoginResult(result) && result.authenticated && result.accessToken) {
        await signIn(result.accessToken);
        toast.success(t("messages.signedInSuccess"));
        navigate("/home", { replace: true });
        return;
      }

      toast.info(t("messages.socialAccountFound"));
      navigate("/select-role");
    },
    [navigate, signIn]
  );

  const handleGoogleClick = () => {
    if (!googleEnabled) {
      toast.error(t("messages.googleSignInUnavailable"));
      return;
    }

    const redirectUri = `${window.location.origin}/login`;
    const state = createRandomState();
    const nonce = createRandomState();

    sessionStorage.setItem(SOCIAL_STATE_KEY, state);
    sessionStorage.setItem(SOCIAL_PROVIDER_KEY, "google");

    const params = new URLSearchParams({
      client_id: socialConfig.googleClientId,
      redirect_uri: redirectUri,
      response_type: "id_token",
      scope: "openid email profile",
      nonce,
      state,
      prompt: "select_account",
    });

    setLoadingProvider("google");
    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    );
  };

  const handleLinkedInClick = () => {
    if (!linkedInEnabled) {
      toast.error(t("messages.linkedinSignInUnavailable"));
      return;
    }

    const redirectUri = `${window.location.origin}/login`;
    const state = createRandomState();

    sessionStorage.setItem(SOCIAL_STATE_KEY, state);
    sessionStorage.setItem(SOCIAL_PROVIDER_KEY, "linkedin");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: socialConfig.linkedinClientId,
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state,
    });

    setLoadingProvider("linkedin");
    window.location.assign(
      `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
    );
  };

  // Load social provider configuration once.
  useEffect(() => {
    let active = true;

    const loadConfig = async () => {
      try {
        const config = await getSocialConfig();
        if (!active) return;

        setSocialConfig({
          googleClientId: config.googleClientId ?? "",
          linkedinClientId: config.linkedinClientId ?? "",
        });
      } catch {
        if (!active) return;

        setSocialConfig({ googleClientId: "", linkedinClientId: "" });
      }
    };

    void loadConfig();

    return () => {
      active = false;
    };
  }, []);

  // Handle OAuth callback for Google (hash fragment) and LinkedIn (query params).
  useEffect(() => {
    const runOAuthCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash
      );

      const provider = sessionStorage.getItem(SOCIAL_PROVIDER_KEY);
      const expectedState = sessionStorage.getItem(SOCIAL_STATE_KEY);

      const linkedInCode = searchParams.get("code");
      const linkedInState = searchParams.get("state");
      const linkedInError = searchParams.get("error");
      const googleIdToken = hashParams.get("id_token");
      const googleState = hashParams.get("state");
      const googleError = hashParams.get("error");

      if (!linkedInCode && !googleIdToken && !linkedInError && !googleError) {
        return;
      }

      if (linkedInError || googleError) {
        toast.error(t("messages.socialSignInCancelled"));
        clearOAuthCallbackParams();
        sessionStorage.removeItem(SOCIAL_PROVIDER_KEY);
        sessionStorage.removeItem(SOCIAL_STATE_KEY);
        return;
      }

      if (!expectedState) {
        toast.error(t("messages.invalidSocialState"));
        clearOAuthCallbackParams();
        sessionStorage.removeItem(SOCIAL_PROVIDER_KEY);
        return;
      }

      try {
        if (linkedInCode) {
          if (provider !== "linkedin" || linkedInState !== expectedState) {
            throw new Error("Invalid LinkedIn callback state");
          }

          setLoadingProvider("linkedin");
          const result = await linkedinLogin({
            code: linkedInCode,
            redirectUri: `${window.location.origin}/login`,
          });
          await handleSocialLoginSuccess(result);
        }

        if (googleIdToken) {
          if (provider !== "google" || googleState !== expectedState) {
            throw new Error("Invalid Google callback state");
          }

          setLoadingProvider("google");
          const result = await googleLogin({ idToken: googleIdToken });
          await handleSocialLoginSuccess(result);
        }
      } catch (error) {
        const message = extractApiErrorMessage(
          error,
          t("messages.unableToSignIn")
        );
        toast.error(message);
      } finally {
        clearOAuthCallbackParams();
        setLoadingProvider(null);
        sessionStorage.removeItem(SOCIAL_PROVIDER_KEY);
        sessionStorage.removeItem(SOCIAL_STATE_KEY);
      }
    };

    void runOAuthCallback();
  }, [handleSocialLoginSuccess]);

  useEffect(() => {
    if (hasHandledState.current) return;

    const state = location.state as { email?: string; message?: string } | null;
    if (!state) return;

    hasHandledState.current = true;

    if (state.email) {
      handleChange("email")(state.email);
    }

    if (state.message) {
      toast.success(state.message);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, handleChange, navigate, location.pathname]);

  // Load remembered login (username or email) on component mount
  useEffect(() => {
    loadRememberedEmail();
  }, [loadRememberedEmail]);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  return (
    <AuthLayout ctaButton={{ to: "/select-role", label: t("pages.signup") }}>
      <div className="w-full max-w-5xl min-h-150 bg-white rounded-3xl shadow-xl grid md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="bg-linear-to-br from-dark-panel-from to-dark-panel-to text-white p-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight">
            {t("pages.login.heroTitlePart1")} <br />
            {t("pages.login.heroTitlePart2")}
          </h1>

          <p className="text-gray-300 mt-6">{t("pages.login.heroSubtitle")}</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">
            {t("pages.login.welcomeBack")}
          </h2>

          <p className="text-gray-500 mb-8">{t("pages.login.subtitle")}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(formData);
            }}
            className="space-y-6"
          >
            {/* USERNAME OR EMAIL */}
            <FormField label={t("labels.username")} error={errors.email}>
              <Input
                name="username"
                autoComplete="username"
                icon={<MdAccountCircle />}
                type="text"
                placeholder={t("placeholders.username")}
                value={formData.email}
                onChange={(e) => handleChange("email")(e.target.value)}
              />
            </FormField>

            {/* PASSWORD */}
            <FormField label={t("labels.password")} error={errors.password}>
              <Input
                name="password"
                autoComplete="current-password"
                icon={<MdLockOutline />}
                type={showPassword ? "text" : "password"}
                placeholder={t("placeholders.password")}
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
                onChange={(value: boolean) => handleChange("rememberMe")(value)}
                label={t("pages.login.rememberMe")}
              />

              <Link to="/forgot-password" className="text-lime-500">
                {t("pages.login.forgotPasswordLink")}
              </Link>
            </div>

            {/* SIGN IN */}
            <Button
              variant="primary"
              size="xl"
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center gap-2 cursor-pointer"
            >
              <HiOutlineArrowRight />
              {isLoading ? t("pages.login.signingIn") : t("buttons.signIn")}
            </Button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-gray-400">
                {t("pages.login.orContinueWith")}
              </span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* SOCIAL LOGIN */}
            <SocialLoginButtons
              onGoogleClick={handleGoogleClick}
              onLinkedInClick={handleLinkedInClick}
              googleDisabled={!googleEnabled}
              linkedInDisabled={!linkedInEnabled}
              loadingProvider={loadingProvider}
            />
            {/* REGISTER LINK */}
            <div className="text-center mt-6 text-sm">
              <span className="text-slate-500">
                {t("pages.login.noAccount")}{" "}
              </span>
              <Link to="/select-role" className="text-lime-500 hover:underline">
                {t("pages.login.registerLink")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
