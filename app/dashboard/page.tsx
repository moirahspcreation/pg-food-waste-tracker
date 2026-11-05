
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PG = {
  id: string;
  name: string;
  address: string;
};

type Invitation = {
  code: string;
  max_uses: number;
  uses_count: number;
  expires_at: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [pgs, setPgs] = useState<PG[]>([]);
  const [invitations, setInvitations] = useState<
    Record<string, Invitation>
  >({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPGs() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("pgs")
          .select("id, name, address")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPgs(data ?? []);
      } catch (error) {
        console.error(error);
        setMessage("Could not load PG details.");
      } finally {
        setLoading(false);
      }
    }

    loadPGs();
  }, [router]);

  async function generateCode(pgId: string) {
    setCreating(pgId);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const code = `FT${crypto.randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)
        .toUpperCase()}`;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase
        .from("invitations")
        .insert({
          pg_id: pgId,
          created_by: user.id,
          code,
          max_uses: 50,
          expires_at: expiresAt.toISOString(),
        })
        .select("code, max_uses, uses_count, expires_at")
        .single();

      if (error) throw error;

      setInvitations((previous) => ({
        ...previous,
        [pgId]: data,
      }));

      setMessage("Invitation code created successfully!");
    } catch (error) {
      console.error("Invitation error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not generate invitation code."
      );
    } finally {
      setCreating(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          FoodTrack
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          PG Owner Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          Manage your PG and help reduce food waste.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Your PGs</h2>

          {loading ? (
            <p className="mt-5 text-slate-400">
              Loading your PG details...
            </p>
          ) : pgs.length > 0 ? (
            <div className="mt-5 space-y-5">
              {pgs.map((pg) => (
                <article
                  key={pg.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <h3 className="text-xl font-semibold">
                    {pg.name}
                  </h3>

                  <p className="mt-3 text-slate-400">
                    {pg.address}
                  </p>

                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <h4 className="font-semibold">
                      Student Invitation
                    </h4>

                    {invitations[pg.id] ? (
                      <div className="mt-4 rounded-xl bg-slate-950 p-4">
                        <p className="text-sm text-slate-400">
                          Your invitation code
                        </p>

                        <p className="mt-2 text-2xl font-bold tracking-widest text-blue-400">
                          {invitations[pg.id].code}
                        </p>

                        <p className="mt-3 text-sm text-slate-400">
                          Maximum uses: {invitations[pg.id].max_uses}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Students joined: {invitations[pg.id].uses_count}
                        </p>

                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              invitations[pg.id].code
                            )
                          }
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                        >
                          Copy Code
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => generateCode(pg.id)}
                        disabled={creating === pg.id}
                        className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
                      >
                        {creating === pg.id
                          ? "Generating..."
                          : "Generate Invitation Code"}
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    PG ID: {pg.id}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-slate-400">
              No PG found. Please create your PG first.
            </p>
          )}

          {message && (
            <p role="status" className="mt-5 text-sm text-blue-300">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
