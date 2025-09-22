"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Signup successful! Please check your email to confirm your account.");
      window.location.href = "/login";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 transition-colors">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block mb-1 text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-50"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must be at least 8 characters, include a number and a
              special character.
            </p>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
