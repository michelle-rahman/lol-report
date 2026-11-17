import { signInWithGoogleAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { getMissingAuthEnvVars } from "@/utils/supabase/env";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const studySteps = [
  {
    number: "01",
    title: "Image + AI caption",
    description: "Crackd.ai pairs user-uploaded images with AI-written captions.",
  },
  {
    number: "02",
    title: "Audience votes",
    description: "People upvote or downvote captions in humor studies.",
  },
  {
    number: "03",
    title: "Admin insights",
    description: "Reports help admins explore results and participation.",
  },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const missingEnvVars = getMissingAuthEnvVars();
  const isAuthConfigured = missingEnvVars.length === 0;

  return (
    <main className="page-shell min-h-screen px-5 py-6 text-foreground sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:gap-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-2xl text-sm font-black tracking-tight text-white shadow-lg"
              style={{ background: "var(--accent-strong)" }}
            >
              LOL
            </span>
            <div>
              <p className="font-semibold tracking-tight">The LOL Report</p>
              <p className="app-muted text-xs">Humor Project admin insights</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-12">
          <div className="space-y-8 sm:space-y-10">
            <section className="max-w-3xl pt-1 sm:pt-4">
              <p className="app-kicker text-xs font-bold uppercase tracking-[0.2em]">
                Humor Project · Admin reporting
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                The data behind the laughs.
              </h1>
              <p className="app-muted mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                The LOL Report helps Humor Project admins explore study results,
                voting patterns, and participant engagement—all in one place.
              </p>
            </section>

            <section
              aria-labelledby="about-humor-project"
              className="app-panel rounded-3xl p-6 sm:p-8"
            >
              <p className="app-kicker text-xs font-bold uppercase tracking-[0.18em]">
                A little context
              </p>
              <h2
                id="about-humor-project"
                className="mt-3 text-2xl font-semibold tracking-tight"
              >
                What is the Humor Project?
              </h2>
              <p className="app-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                Crackd.ai pairs user-uploaded images with captions written by
                AI to create meme ideas. In humor studies, people vote on those
                captions to help researchers understand what different
                audiences find funny. This report turns those votes into useful
                insights for the project team.
              </p>
            </section>

            <section aria-labelledby="study-flow-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="app-kicker text-xs font-bold uppercase tracking-[0.18em]">
                    From image to insight
                  </p>
                  <h2
                    id="study-flow-heading"
                    className="mt-2 text-xl font-semibold tracking-tight"
                  >
                    How a humor study works
                  </h2>
                </div>
                <p className="app-muted text-sm">A few votes can tell a story.</p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-3">
                {studySteps.map((step) => (
                  <li
                    key={step.number}
                    className="app-card rounded-2xl p-4 sm:p-5"
                  >
                    <span className="app-kicker text-xs font-bold tracking-[0.14em]">
                      {step.number}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                    <p className="app-muted mt-2 text-sm leading-5">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="app-panel rounded-3xl p-6 sm:p-8 lg:sticky lg:top-8">
            <span className="inline-flex items-center rounded-full border border-[var(--button-border)] bg-[var(--button-bg)] px-3 py-1 text-xs font-semibold text-foreground">
              Authorized admins
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              Ready to dig into the data?
            </h2>
            <p className="app-muted mt-3 text-sm leading-6">
              Sign in with your approved Humor Project Google account to open
              the reports.
            </p>

            {params.error ? (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              >
                {params.error}
              </p>
            ) : null}

            {!isAuthConfigured ? (
              <p
                role="status"
                className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
              >
                Google sign-in isn’t available right now. Please contact a
                Humor Project administrator.
              </p>
            ) : null}

            <form action={signInWithGoogleAction} className="mt-6">
              <button
                type="submit"
                disabled={!isAuthConfigured}
                className="app-button app-button-primary flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a6.48 6.48 0 0 1-2.21 3.31v2.77h3.57a10.83 10.83 0 0 0 3.28-8.09Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77a6.45 6.45 0 0 1-3.71 1.06 6.28 6.28 0 0 1-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09A6.57 6.57 0 0 1 5.5 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.93 10.93 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84A6.28 6.28 0 0 1 12 5.38Z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="app-muted mt-4 text-center text-xs leading-5">
              Access is limited to approved Humor Project administrators.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
