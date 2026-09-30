"use client";

import { useEffect, useMemo, useState } from "react";

import { DraftPost, ScheduledPost } from "@/lib/models";

export default function CalendarPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [draftId, setDraftId] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshData() {
    const [scheduleRes, draftsRes] = await Promise.all([fetch("/api/schedule"), fetch("/api/drafts")]);
    const scheduleData = await scheduleRes.json();
    const draftsData = await draftsRes.json();

    if (!scheduleRes.ok) throw new Error(scheduleData.error || "Failed to load schedule");
    if (!draftsRes.ok) throw new Error(draftsData.error || "Failed to load drafts");

    setScheduledPosts(scheduleData.scheduledPosts);
    setDrafts(draftsData.drafts);
    if (!draftId && draftsData.drafts.length > 0) {
      setDraftId(draftsData.drafts[0].id);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [scheduleRes, draftsRes] = await Promise.all([fetch("/api/schedule"), fetch("/api/drafts")]);
        const scheduleData = await scheduleRes.json();
        const draftsData = await draftsRes.json();

        if (!scheduleRes.ok) throw new Error(scheduleData.error || "Failed to load schedule");
        if (!draftsRes.ok) throw new Error(draftsData.error || "Failed to load drafts");

        if (!cancelled) {
          setScheduledPosts(scheduleData.scheduledPosts);
          setDrafts(draftsData.drafts);
          if (draftsData.drafts.length > 0) {
            setDraftId((prev) => prev || draftsData.drafts[0].id);
          }
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function schedulePost() {
    if (!draftId || !scheduledFor) {
      setError("Select draft and date/time.");
      return;
    }

    setError(null);
    const response = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId, scheduledFor }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to schedule.");
      return;
    }

    setScheduledFor("");
    await refreshData();
  }

  const grouped = useMemo(() => {
    return scheduledPosts.reduce<Record<string, ScheduledPost[]>>((acc, post) => {
      const dateKey = new Date(post.scheduledFor).toLocaleDateString();
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(post);
      return acc;
    }, {});
  }, [scheduledPosts]);

  if (loading) {
    return <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm">Loading calendar...</section>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Schedule Post</h2>
        <p className="mt-1 text-sm text-slate-600">Agenda view with mock scheduling API.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-sm">
            Draft
            <select value={draftId} onChange={(event) => setDraftId(event.target.value)} className="rounded-md border border-slate-300 px-2 py-2">
              {drafts.map((draft) => (
                <option key={draft.id} value={draft.id}>
                  {draft.topic} ({draft.platform.toUpperCase()})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Date & time
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(event) => setScheduledFor(event.target.value)}
              className="rounded-md border border-slate-300 px-2 py-2"
            />
          </label>

          <div className="flex items-end">
            <button type="button" onClick={schedulePost} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
              Schedule
            </button>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold">Upcoming Agenda</h3>
        {Object.keys(grouped).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No scheduled posts yet.</p>
        ) : (
          <div className="mt-3 space-y-4">
            {Object.entries(grouped).map(([date, posts]) => (
              <article key={date}>
                <h4 className="text-sm font-medium text-slate-700">{date}</h4>
                <ul className="mt-2 space-y-2">
                  {posts.map((post) => (
                    <li key={post.id} className="rounded-md border border-slate-200 p-3 text-sm">
                      <p className="font-medium">{post.platform.toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{new Date(post.scheduledFor).toLocaleTimeString()}</p>
                      <p className="mt-1 text-slate-700">{post.text}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
