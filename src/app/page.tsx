"use client";

import { useState } from "react";

export default function Dashboard() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-8 text-blue-600 dark:text-blue-400">
            StudyTime
          </h1>

          <nav className="flex-1 space-y-4">
            <a className="block font-medium text-gray-700 dark:text-gray-200">Dashboard</a>
            <a className="block text-gray-600 dark:text-gray-400">New Block</a>
            <a className="block text-gray-600 dark:text-gray-400">History</a>
            <a className="block text-gray-600 dark:text-gray-400">Account</a>
          </nav>

          {/* Light/Dark toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="mt-auto flex items-center gap-2 px-3 py-2 rounded
                       bg-gray-200 dark:bg-gray-700
                       text-gray-800 dark:text-gray-100
                       hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 text-gray-800 dark:text-gray-100">
          <h2 className="text-3xl font-semibold mb-2">
            Good afternoon, Robin!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Here’s what’s happening with your silent-study schedule.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Upcoming Blocks" value="3" />
            <StatCard title="Completed Blocks" value="5" />
            <StatCard title="Total Blocks" value="8" />
          </div>

          {/* Scheduled Blocks */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4">Scheduled Study Blocks</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { start: "Today 6:00 PM", end: "8:00 PM" },
                { start: "Tomorrow 9:00 AM", end: "11:00 AM" },
                { start: "Friday 7:00 PM", end: "9:00 PM" },
              ].map((b, i) => (
                <li key={i} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{b.start} – {b.end}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created 2 hours ago
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Activity */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              <li>Reminder email sent for Today’s 6 PM block (10 mins ago)</li>
              <li>New study block scheduled for Friday (1 hour ago)</li>
              <li>Completed block: Yesterday 8 PM (12 hours ago)</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{title}</p>
    </div>
  );
}
