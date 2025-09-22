"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

interface Block {
  _id: string;
  userId: string;
  title: string;
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
}

type View = "dashboard" | "blocks" | "history" | "account";

interface NewBlockFormProps {
  userId: string;
  onSuccess: () => void;
  blockToEdit?: Block;
}

function NewBlockForm({ userId, onSuccess, blockToEdit }: NewBlockFormProps) {
  const [title, setTitle] = useState(blockToEdit?.title ?? "");
  const [date, setDate] = useState(blockToEdit?.date ?? "");
  const [dayName, setDayName] = useState(blockToEdit?.dayName ?? "");
  const [startTime, setStartTime] = useState(blockToEdit?.startTime ?? "");
  const [endTime, setEndTime] = useState(blockToEdit?.endTime ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res: Response;
      if (blockToEdit) {
        res = await fetch("/api/blocks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: blockToEdit._id,
            updatedData: { title, date, dayName, startTime, endTime },
          }),
        });
      } else {
        res = await fetch("/api/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title, date, dayName, startTime, endTime }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTitle("");
      setDate("");
      setDayName("");
      setStartTime("");
      setEndTime("");
      onSuccess();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        {blockToEdit ? "Edit Study Block" : "Create New Study Block"}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300 text-lg">Block Title</span>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            className="mt-2 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 text-lg">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              required
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 text-lg">Day Name</span>
            <input
              type="text"
              value={dayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDayName(e.target.value)}
              required
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 text-lg">Start Time</span>
            <input
              type="time"
              value={startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
              required
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 text-lg">End Time</span>
            <input
              type="time"
              value={endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
              required
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </label>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-6 rounded-lg bg-blue-600 text-white font-bold text-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {loading ? (blockToEdit ? "Updating..." : "Creating...") : blockToEdit ? "Update Block" : "Create Block"}
        </button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const fetchBlocks = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/blocks?userId=${userId}`);
      const data: { blocks: Block[]; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch blocks");
      setBlocks(data.blocks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;
    try {
      const res = await fetch("/api/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data: { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      fetchBlocks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) router.replace("/login");
      else {
        setUserName(user.user_metadata?.full_name || user.email);
        setUserId(user.id);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    fetchBlocks();
  }, [userId]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-700 dark:text-gray-300">Loading…</div>;

  function renderMainContent() {
    switch (activeView) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Good afternoon{userName && `, ${userName}`}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Here’s what’s happening with your silent-study schedule.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard title="Upcoming Blocks" value={blocks.length.toString()} />
              <StatCard title="Completed Blocks" value="5" />
              <StatCard title="Total Blocks" value={blocks.length.toString()} />
            </div>
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Scheduled Study Blocks
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {blocks.map((b) => (
                  <li key={b._id} className="py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {b.date} ({b.dayName}) {b.startTime} – {b.endTime}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created recently</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm" onClick={() => setEditingBlock(b)}>Edit</button>
                      <button className="text-red-500 hover:text-red-700 text-sm" onClick={() => handleDelete(b._id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        );
      case "blocks":
        return (
          <div className="flex justify-center items-start mt-10">
            {userId && (
              <NewBlockForm
                userId={userId}
                blockToEdit={editingBlock || undefined}
                onSuccess={() => {
                  setEditingBlock(null);
                  fetchBlocks();
                }}
              />
            )}
          </div>
        );
      case "history":
        return <p className="text-gray-700 dark:text-gray-300">History view coming soon…</p>;
      case "account":
        return <p className="text-gray-700 dark:text-gray-300">Account settings coming soon…</p>;
    }
  }

  return (
    <div>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-8 text-blue-600 dark:text-blue-400">StudyTime</h1>
          <nav className="flex-1 space-y-4">
            {["dashboard", "blocks", "history", "account"].map((tab) => (
              <button
                key={tab}
                className={`block text-left w-full p-2 rounded-lg ${
                  activeView === tab
                    ? "font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveView(tab as View)}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
            Log out
          </button>
        </aside>
        <main className="flex-1 p-8 text-gray-800 dark:text-gray-100">{renderMainContent()}</main>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
      <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
      <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">{title}</p>
    </div>
  );
}
