"use client";

import { useState } from "react";

export default function LoginPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
            Welcome Back
          </h1>

          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 dark:text-blue-400 underline">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
