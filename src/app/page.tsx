"use client";

import Image from "next/image";

import { useState } from "react";

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <main className="relative min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors overflow-hidden">
        {/* Purple wave background */}
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-br from-purple-500 to-indigo-600 clip-wave"></div>

        {/* Navigation */}
        <header className="flex justify-between items-center px-8 py-6 relative z-10">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            QuietStudy
          </h1>
          <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="/login">Login</a>
          </nav>
          <button
            onClick={() => setDark(!dark)}
            className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700
                       text-gray-800 dark:text-gray-100"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </header>

        {/* Content */}
        <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 pt-10 md:pt-20">
          {/* Left text */}
          <div className="max-w-lg text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              Your Quiet Study Scheduler
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Plan silent-study blocks and get reminders before each session.
              Stay focused, stay consistent.
            </p>
            <a
              href="/signup"
              className="inline-block mt-6 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700
                         text-white font-semibold shadow-lg"
            >
              Sign Up Free
            </a>
          </div>

         {/* Right illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-xl shadow-xl overflow-hidden">
          <Image
            src="/study.jpeg"        
            alt="Studying illustration"
            fill                     
            className="object-cover" 
            priority
           />
         </div>
        </div>

        </section>
      </main>
    </div>
  );
}
