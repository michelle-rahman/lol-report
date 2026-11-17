import { TopNavbar } from "@/components/top-navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const NEW_STYLE_MIN_STUDY_ID = 7;

const studyDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "America/New_York",
});

const formatStudyDate = (value: string | null) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : studyDateFormatter.format(date);
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [
    { data: studies, error: studiesError },
    { data: newStyleStudies, error: newStyleStudiesError },
  ] = await Promise.all([
    supabase.from("studies").select("id").order("id", { ascending: false }).limit(1),
    supabase
      .from("studies")
      .select(
        "id, slug, description, start_datetime_utc, end_datetime_utc, created_datetime_utc",
      )
      .gte("id", NEW_STYLE_MIN_STUDY_ID)
      .order("id", { ascending: false })
      .limit(1),
  ]);

  if (studiesError) {
    throw new Error(`Unable to load studies: ${studiesError.message}`);
  }

  if (newStyleStudiesError) {
    throw new Error(`Unable to load new style studies: ${newStyleStudiesError.message}`);
  }

  const latestStudyId = studies?.[0]?.id ?? null;
  const latestNewStyleStudy = newStyleStudies?.[0] ?? null;
  const latestNewStyleStudyId = latestNewStyleStudy?.id ?? null;
  const latestStudyTitle = latestNewStyleStudy?.slug
    ?? latestNewStyleStudy?.description
    ?? (latestNewStyleStudyId ? `Study ${latestNewStyleStudyId}` : null);
  const latestStudyStart = formatStudyDate(
    latestNewStyleStudy?.start_datetime_utc ?? latestNewStyleStudy?.created_datetime_utc ?? null,
  );
  const latestStudyEnd = formatStudyDate(latestNewStyleStudy?.end_datetime_utc ?? null);
  const additionalReports = [
    {
      title: "Study detail",
      description: "Review study vote details",
      href: latestStudyId ? `/study/${latestStudyId}/study-detail` : null,
    },
    {
      title: "Study engagement risk",
      description: "Find low-engagement raters",
      href: latestStudyId ? `/study/${latestStudyId}/engagement-risk` : null,
    },
    {
      title: "Study-to-study comparison",
      description: "Compare two studies",
      href: "/reports/study-comparison",
    },
    {
      title: "Weekly humor study summary",
      description: "Track weekly study trends",
      href: "/reports/weekly-study-summary",
    },
    {
      title: "Study voting span by user",
      description: "Review voting duration",
      href: latestStudyId ? `/study/${latestStudyId}/vote-timing` : null,
    },
    {
      title: "Study upvote percentage by user",
      description: "Compare individual upvote rates",
      href: latestStudyId ? `/study/${latestStudyId}/user-upvote-rate` : null,
    },
    {
      title: "Selected user report",
      description: "Analyze selected raters together",
      href: latestStudyId ? `/study/${latestStudyId}/selected-user-report` : null,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <main className="page-shell flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <section className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="app-kicker text-xs font-semibold uppercase tracking-[0.24em]">
                Humor Study Stats
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Admin dashboard
              </h1>
              <p className="app-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                Explore how audiences respond to AI-written captions, compare
                humor studies, and review participation patterns.
              </p>
            </div>
            <p className="app-muted text-sm">
              Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
          </section>

          <section
            className="app-panel rounded-3xl p-6 sm:p-8"
            aria-labelledby="latest-study-heading"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="app-kicker text-xs font-semibold uppercase tracking-[0.2em]">
                  Start here
                </p>
                <h2
                  id="latest-study-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight"
                >
                  Latest humor study
                </h2>
                <p className="app-muted mt-2 max-w-2xl text-sm leading-6">
                  Open the latest study report for caption navigation and voting
                  activity, including skip rates, time spent, and vote coverage.
                </p>
              </div>
              {latestNewStyleStudyId ? (
                <span className="app-card rounded-full px-3 py-1 text-xs font-medium">
                  Study {latestNewStyleStudyId}
                </span>
              ) : null}
            </div>

            {latestNewStyleStudyId ? (
              <div className="app-card mt-6 rounded-2xl p-5 sm:p-6">
                <p className="app-muted text-xs font-semibold uppercase tracking-[0.16em]">
                  Study name
                </p>
                <h3 className="mt-2 break-words text-xl font-semibold sm:text-2xl">
                  {latestStudyTitle}
                </h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="app-muted text-xs font-semibold uppercase tracking-[0.14em]">
                      Study window
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {latestStudyStart ?? "Start date not available"}
                      {" – "}
                      {latestStudyEnd ?? "End date not recorded"}
                    </p>
                    <p className="app-muted mt-1 text-xs">
                      Dates shown in Eastern Time.
                    </p>
                  </div>
                  <div className="flex items-end sm:justify-end">
                    <Link
                      href={`/study/${latestNewStyleStudyId}/new-style-report`}
                      className="app-button app-button-primary inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold transition sm:w-auto"
                    >
                      View latest study stats
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="app-card mt-6 rounded-2xl p-5 text-sm">
                No newer-format studies are available yet.
              </p>
            )}
          </section>

          <section
            className="app-panel rounded-3xl p-6 sm:p-8"
            aria-labelledby="report-options-heading"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="app-kicker text-xs font-semibold uppercase tracking-[0.2em]">
                  Explore the data
                </p>
                <h2
                  id="report-options-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight"
                >
                  More ways to investigate
                </h2>
                <p className="app-muted mt-2 max-w-2xl text-sm leading-6">
                  Review vote-level details, compare results across studies,
                  follow weekly trends, or inspect how individual participants
                  voted.
                </p>
              </div>
              <details className="group w-full sm:w-auto">
                <summary className="app-button flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition marker:content-none">
                  Browse reports
                  <span className="text-xs transition group-open:rotate-180" aria-hidden="true">
                    &#9660;
                  </span>
                </summary>
                <div className="app-card mt-3 grid w-full gap-2 rounded-xl p-3 sm:w-[36rem] sm:grid-cols-2">
                  {additionalReports.map((reportOption) =>
                    reportOption.href ? (
                      <Link
                        key={reportOption.title}
                        href={reportOption.href}
                        className="app-button rounded-lg px-3 py-2 text-sm transition"
                      >
                        <span className="block font-medium">{reportOption.title}</span>
                        <span className="app-muted mt-0.5 block text-xs">
                          {reportOption.description}
                        </span>
                      </Link>
                    ) : (
                      <span
                        key={reportOption.title}
                        className="app-button cursor-not-allowed rounded-lg px-3 py-2 text-sm opacity-60"
                      >
                        <span className="block font-medium">{reportOption.title}</span>
                        <span className="app-muted mt-0.5 block text-xs">
                          {reportOption.description}
                        </span>
                      </span>
                    ),
                  )}
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
