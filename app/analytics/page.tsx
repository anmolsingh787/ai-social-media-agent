import { getAnalyticsOverview } from "@/lib/services/mock-store";

export default function AnalyticsPage() {
  const analytics = getAnalyticsOverview();

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Analytics are currently <strong>mock/demo data</strong>. Real platform metrics require LinkedIn/X API credentials.
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Drafts in queue</p>
          <p className="mt-2 text-2xl font-semibold">{analytics.drafts}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Scheduled</p>
          <p className="mt-2 text-2xl font-semibold">{analytics.scheduled}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-2 text-2xl font-semibold">{analytics.published}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Engagement rate</p>
          <p className="mt-2 text-2xl font-semibold">{analytics.engagementRate}</p>
        </article>
      </section>
    </div>
  );
}
