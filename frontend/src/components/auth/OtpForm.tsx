import React, { useRef, useState } from "react";
import { Link } from "react-router";
import Label from "../form/Label";
import { ChevronLeftIcon } from "../../icons";

export default function OtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace") {
      const updatedOtp = [...otp];
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
      updatedOtp[index] = "";
      setOtp(updatedOtp);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    }

    if (event.key === "ArrowRight" && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").slice(0, 6).split("");
    const updatedOtp = [...otp];
    pasteData.forEach((char, idx) => {
      if (idx < updatedOtp.length) {
        updatedOtp[idx] = char;
      }
    });
    setOtp(updatedOtp);
    const filledIndex = pasteData.length - 1;
    if (inputsRef.current[filledIndex]) {
      inputsRef.current[filledIndex].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted OTP: ${otp.join("")}`);
  };

  const isComplete = otp.every((digit) => digit !== "");

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
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{
                background: "rgba(81, 39, 131, 0.15)",
                border: "1px solid rgba(81, 39, 131, 0.25)",
                boxShadow: "0 0 30px rgba(81, 39, 131, 0.15)",
              }}
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                  stroke="#9a6fc3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="#f18918"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-white/90 dark:text-white/90 sm:text-3xl">
              Two-Step Verification
            </h1>
            <p className="text-sm text-white/50 dark:text-white/50 leading-relaxed">
              A verification code has been sent to your device.
              <br />
              Please enter the 6-digit code below.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>Security Code</Label>
                <div className="flex gap-2 sm:gap-3" id="otp-container">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={(e) => handlePaste(e)}
                      ref={(el) => {
                        if (el) {
                          inputsRef.current[index] = el;
                        }
                      }}
                      className="h-14 w-full rounded-xl text-center text-xl font-semibold transition-all duration-200 focus:outline-none"
                      style={{
                        background: otp[index]
                          ? "rgba(81, 39, 131, 0.12)"
                          : "rgba(255, 255, 255, 0.05)",
                        border: otp[index]
                          ? "1px solid rgba(81, 39, 131, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.9)",
                        boxShadow: otp[index]
                          ? "0 0 15px rgba(81, 39, 131, 0.15)"
                          : "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(81, 39, 131, 0.5)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(81, 39, 131, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = otp[index]
                          ? "rgba(81, 39, 131, 0.4)"
                          : "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.boxShadow = otp[index]
                          ? "0 0 15px rgba(81, 39, 131, 0.15)"
                          : "none";
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center gap-1.5">
                {otp.map((digit, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: digit ? "24px" : "8px",
                      background: digit
                        ? "linear-gradient(90deg, #512783, #f18918)"
                        : "rgba(255, 255, 255, 0.15)",
                    }}
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isComplete}
                  className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-medium text-white transition-all rounded-xl shadow-theme-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: isComplete
                      ? "linear-gradient(135deg, #512783 0%, #7b3fa5 100%)"
                      : "rgba(81, 39, 131, 0.3)",
                    boxShadow: isComplete
                      ? "0 4px 20px rgba(81, 39, 131, 0.3)"
                      : "none",
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
                  </svg>
                  Verify My Account
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm font-normal text-center text-white/50 dark:text-white/50">
              Didn't get the code?{" "}
              <button className="text-[#f18918] hover:text-[#f89c3d] transition-colors font-medium">
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
