
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#111820] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-blue-400";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : error.message
        );
        return;
      }

      if (data.user) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Unable to sign in. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f14] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold">
            F
          </div>
          <span className="text-xl font-semibold">FoodTrack</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
          <p className="text-sm font-medium text-blue-400">WELCOME BACK</p>

          <h1 className="mt-3 text-3xl font-bold">Sign in to FoodTrack</h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Sign in to manage your PG meals and reduce food waste.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-blue-500 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {message && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-6 text-red-200"
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Create account
            </Link>
          </p>

          <Link
            href="/"
            className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
