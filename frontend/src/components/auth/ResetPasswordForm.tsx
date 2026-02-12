import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function ResetPasswordForm() {
  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2 px-4 sm:px-6">
      <div className="w-full max-w-md pt-8 mx-auto sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm transition-colors text-white/50 hover:text-white/80 dark:text-white/50 dark:hover:text-white/80"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* ── Glass Form Card ── */}
        <div
          className="relative p-6 rounded-2xl sm:p-8"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background: "rgba(241, 137, 24, 0.1)",
                border: "1px solid rgba(241, 137, 24, 0.2)",
                boxShadow: "0 0 30px rgba(241, 137, 24, 0.1)",
              }}
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="#f18918"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
                  stroke="#9a6fc3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16.5" r="1.5" fill="#f18918" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-white/90 dark:text-white/90 sm:text-3xl">
              Forgot Password?
            </h1>
            <p className="text-sm text-white/50 dark:text-white/50 leading-relaxed">
              No worries! Enter the email address linked to your account
              and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form>
            <div className="space-y-5">
              <div>
                <Label>
                  Email Address<span className="text-[#f18918]">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <button
                  className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-medium text-white transition-all rounded-xl hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #512783 0%, #7b3fa5 100%)",
                    boxShadow: "0 4px 20px rgba(81, 39, 131, 0.3)",
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Send Reset Link
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm font-normal text-center text-white/50 dark:text-white/50">
              Wait, I remember my password...{" "}
              <Link
                to="/signin"
                className="text-[#f18918] hover:text-[#f89c3d] transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
