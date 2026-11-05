
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Meal Planning",
    description:
      "Know how many students are joining breakfast, lunch, and dinner.",
  },
  {
    number: "02",
    title: "Student Responses",
    description:
      "Let students confirm their meals before your daily deadline.",
  },
  {
    number: "03",
    title: "Reduce Food Waste",
    description:
      "Plan food quantities with clearer meal counts and less guesswork.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold text-white">
            F
          </div>
          <span className="text-lg font-semibold tracking-tight">
            FoodTrack
          </span>
        </Link>

        <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
          PG Food Management
        </span>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pb-28 md:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Smarter meals. Less waste.
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Serve the right amount.
            <span className="mt-2 block text-blue-400">
              Waste less food.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
            A simpler way for PG owners and students to plan daily meals.
            Track breakfast, lunch, and dinner responses before food is
            prepared.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-400"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-500">
            Built for PG owners and residents.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-blue-950/20 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Meal overview</p>
              <h2 className="mt-1 text-xl font-semibold">
                Daily planning
              </h2>
            </div>
            <span className="rounded-lg bg-blue-400/10 px-3 py-2 text-xs font-medium text-blue-300">
              PREVIEW
            </span>
          </div>

          <div className="mt-7 space-y-4">
            {[
              { name: "Breakfast", time: "Morning", icon: "☀️" },
              { name: "Lunch", time: "Afternoon", icon: "🍱" },
              { name: "Dinner", time: "Evening", icon: "🌙" },
            ].map((meal) => (
              <div
                key={meal.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111820] p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                    {meal.icon}
                  </div>
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {meal.time}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-gray-400">
                  Meal tracking
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-400/15 bg-blue-400/[0.06] p-4">
            <p className="font-medium text-blue-300">
              Plan before you prepare
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Student meal responses will help owners make better food
              estimates.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              How it helps
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Better planning starts with knowing.
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              One place to organize meal participation and make daily food
              preparation more predictable.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-2xl border border-white/10 bg-[#10161d] p-6"
              >
                <p className="text-sm font-semibold text-blue-400">
                  {feature.number}
                </p>
                <h3 className="mt-5 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        FoodTrack · Smarter meal planning for PGs
      </footer>
    </main>
  );
}
