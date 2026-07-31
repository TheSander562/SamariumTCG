import Link from "next/link";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { LandingButtons } from "@/app/landing-buttons";

export const dynamic = "force-dynamic";

const roadmap = [
  { phase: 1, title: "Collection CRUD", status: "planned" as const },
  { phase: 2, title: "Expansions & checklists", status: "planned" as const },
  { phase: 3, title: "Search & filters", status: "planned" as const },
  { phase: 4, title: "Virtual binders", status: "planned" as const },
  { phase: 5, title: "Statistics dashboard", status: "planned" as const },
  { phase: 6, title: "Themes & i18n", status: "planned" as const },
  { phase: 7, title: "Export (CSV/PDF)", status: "planned" as const },
  { phase: 8, title: "Admin & card sync", status: "planned" as const },
  { phase: 9, title: "Backup & image cache", status: "planned" as const },
];

export default async function Home() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-red-600">
              SamariumTCG
            </p>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Collection Tracker
            </h1>
          </div>

          <nav className="flex items-center gap-3">
            <LandingButtons session={session}/>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
        <section>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Self-hosted collection management
          </h2>

          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Track cards, quantities, set completion, virtual binders, and
            analytics.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Delivery roadmap
          </h3>

          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {roadmap.map((item) => (
              <li
                key={item.phase}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium dark:bg-zinc-900">
                  {item.phase}
                </span>

                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs capitalize text-zinc-500">
                    {item.status}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-dashed border-zinc-300 p-6">
          <p className="font-medium">Stack</p>

          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-600">
            <li>Next.js App Router + TypeScript + Tailwind CSS</li>
            <li>PostgreSQL + Prisma ORM</li>
            <li>Better Auth + Authelia OIDC</li>
            <li>Docker Compose for self-hosting</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
