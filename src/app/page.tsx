"use client";

import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <main className="relative min-h-screen transition-colors overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 left-0 h-full w-full -z-10">
          <Image
            src="/study.jpeg"
            alt="Study Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Optional: Dark overlay to make text more readable */}
        <div className="absolute top-0 left-0 h-full w-full bg-black/20 -z-5"></div>

        {/* Navigation */}
        <header className="flex justify-between items-center px-8 py-6 relative z-10">
          <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-700">
            QuietStudy
          </h1>
          <nav className="hidden md:flex gap-6 text-gray-900 dark:text-gray-100">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Content */}
        <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 pt-10 md:pt-20">
          {/* Left text */}
          <div className="max-w-lg text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              Your Quiet Study Scheduler
            </h2>
            <p className="mt-4 text-gray-800 dark:text-purple-700">
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
        </section>
      </main>
    </div>
  );
}
