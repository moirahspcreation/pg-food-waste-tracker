
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestConnectionPage() {
  const [message, setMessage] = useState("Connection test ke liye ready.");

  async function testConnection() {
    setMessage("Testing connection...");

    const { error } = await supabase.auth.getSession();

    if (error) {
      setMessage("Connection error: " + error.message);
      return;
    }

    setMessage("Supabase connected successfully!");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-5 p-6">
      <h1 className="text-3xl font-bold">FoodTrack Connection Test</h1>

      <button
        onClick={testConnection}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
      >
        Test Supabase Connection
      </button>

      <p className="text-center">{message}</p>
    </main>
  );
}
