
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#111820] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-blue-400";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setMessage("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    if (role === "student" && !inviteCode.trim()) {
      setMessage("Please enter the invitation code from your PG owner.");
      return;
    }

    // Invitation codes will be verified against the database
    // before student membership is implemented.
    if (role === "student") {
      setMessage(
        "Student registration is not available yet. We first need to set up secure PG invitation verification. Please select PG Owner only if you actually own a PG."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            role: "owner",
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user && data.user.identities?.length === 0) {
        setMessage(
          "This email may already be registered. Try signing in or use another email."
        );
        return;
      }

      setIsSuccess(true);

      if (data.session) {
        setMessage(
          "Account created successfully! You can now sign in. Your owner dashboard will be set up next."
        );
      } else {
        setMessage(
          "Signup request successful! Check your email for a confirmation link, then sign in. If no email arrives, check your spam folder."
        );
      }
    } catch {
      setMessage(
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f14] px-5 py-12 text-white">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold">
            F
          </div>
          <span className="text-xl font-semibold">FoodTrack</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
          <p className="text-sm font-medium text-blue-400">GET STARTED</p>

          <h1 className="mt-3 text-3xl font-bold">Create your account</h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Join FoodTrack to make daily PG meal planning easier.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-300">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-300">
                I am joining as
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setMessage("");
                  setIsSuccess(false);
                }}
                className={inputClass}
              >
                <option value="student" className="bg-[#111820]">
                  PG Student / Resident
                </option>
                <option value="owner" className="bg-[#111820]">
                  PG Owner
                </option>
              </select>
            </div>

            {role === "student" && (
              <div>
                <label htmlFor="inviteCode" className="mb-2 block text-sm font-medium text-gray-300">
                  PG invitation code
                </label>
                <input
                  id="inviteCode"
                  name="inviteCode"
                  type="text"
                  autoComplete="off"
                  required
                  value={inviteCode}
                  onChange={(event) => setInviteCode(event.target.value)}
                  placeholder="Enter the code from your PG owner"
                  className={inputClass}
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Student registration will be enabled after invitation verification is configured.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-blue-500 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-3 text-sm leading-6 ${
                  isSuccess
                    ? "border-green-400/20 bg-green-400/10 text-green-200"
                    : "border-blue-400/20 bg-blue-400/10 text-blue-200"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>

          <Link
            href="/"
            className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-300"
          >
            ← Back to home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-600">
          FoodTrack protects PG access through verified invitations and
          database permissions.
        </p>
      </div>
    </main>
  );
}
