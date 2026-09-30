import { getAnalyticsOverview, listDrafts, listScheduledPosts } from "@/lib/services/mock-store";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const analytics = getAnalyticsOverview();
  const drafts = listDrafts().slice(0, 4);
  const scheduled = listScheduledPosts().slice(0, 4);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Mock/demo data:</strong> metrics and content below are sample values for MVP workflows.
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Drafts" value={analytics.drafts} />
        <StatCard label="Scheduled Posts" value={analytics.scheduled} />
        <StatCard label="Published Posts" value={analytics.published} />
        <StatCard label="Engagement Rate" value={analytics.engagementRate} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Weekly Activity</h2>
        <div className="mt-4 grid grid-cols-7 gap-2" role="img" aria-label="Weekly activity chart">
          {analytics.weeklyActivity.map((point) => {
            const total = point.drafts + point.scheduled + point.published;
            return (
              <div key={point.day} className="flex flex-col items-center">
                <div className="flex h-28 w-full items-end justify-center rounded bg-slate-100 px-1">
                  <div
                    className="w-full rounded-t bg-slate-900"
                    style={{ height: `${Math.max(12, total * 7)}px` }}
                    title={`${point.day}: ${total} actions`}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">{point.day}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Recent Drafts</h3>
          <ul className="mt-3 space-y-3">
            {drafts.map((draft) => (
              <li key={draft.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium">{draft.topic}</p>
                <p className="text-xs text-slate-500">
                  {draft.platform.toUpperCase()} • {draft.status}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">Upcoming Schedule</h3>
          <ul className="mt-3 space-y-3">
            {scheduled.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium">{item.platform.toUpperCase()}</p>
                <p className="text-xs text-slate-500">{new Date(item.scheduledFor).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
