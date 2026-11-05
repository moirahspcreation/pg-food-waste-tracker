
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PG = {
  id: string;
  name: string;
  address: string;
};

export default function StudentDashboard() {
  const router = useRouter();

  const [pg, setPg] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function loadStudentPG() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .single();

        if (profileError) throw profileError;

        if (profile.role !== "student") {
          router.replace("/dashboard");
          return;
        }

        const { data: membership, error: membershipError } =
          await supabase
            .from("pg_members")
            .select("pg_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (membershipError) throw membershipError;

        if (membership) {
          const { data: pgData, error: pgError } =
            await supabase
              .from("pgs")
              .select("id, name, address")
              .eq("id", membership.pg_id)
              .single();

          if (pgError) throw pgError;
          setPg(pgData);
        }
      } catch (error) {
        console.error("Student dashboard error:", error);
        setMessage("Could not load your student dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadStudentPG();
  }, [router]);

  async function joinPG(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const invitationCode = code.trim().toUpperCase();

    if (!invitationCode) {
      setMessage("Please enter an invitation code.");
      return;
    }

    setJoining(true);

    try {
      const { error } = await supabase.rpc(
        "redeem_pg_invitation",
        { p_code: invitationCode }
      );

      if (error) throw error;

      setMessage("Successfully joined your PG!");
      setCode("");
      window.location.reload();
    } catch (error) {
      console.error("Join PG error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not join PG. Please check your invitation code."
      );
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        Loading your dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          FoodTrack
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          Manage your meals and reduce food waste.
        </p>

        {pg ? (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Your PG
            </h2>

            <h3 className="mt-4 text-2xl font-bold text-blue-400">
              {pg.name}
            </h3>

            <p className="mt-2 text-slate-400">
              {pg.address}
            </p>

            <p className="mt-5 text-green-400">
              You are successfully connected to your PG.
            </p>
          </section>
        ) : (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Join Your PG
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter the invitation code provided by your PG owner.
            </p>

            <form onSubmit={joinPG} className="mt-6 space-y-4">
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter invitation code"
                maxLength={10}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={joining}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
              >
                {joining ? "Joining..." : "Join PG"}
              </button>
            </form>
          </section>
        )}

        {message && (
          <p role="status" className="mt-5 text-sm text-blue-300">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
