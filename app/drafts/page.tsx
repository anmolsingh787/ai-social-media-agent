"use client";

import { useEffect, useState } from "react";

import { DraftPost } from "@/lib/models";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [scheduleByDraft, setScheduleByDraft] = useState<Record<string, string>>({});

  async function refreshDrafts() {
    const response = await fetch("/api/drafts");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load drafts");
    setDrafts(data.drafts);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/drafts");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load drafts");
        if (!cancelled) setDrafts(data.drafts);
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

  async function updateDraft(id: string, payload: Record<string, unknown>) {
    setSavingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update draft");
      setDrafts((prev) => prev.map((draft) => (draft.id === id ? data.draft : draft)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unknown error");
    } finally {
      setSavingId(null);
    }
  }

  async function scheduleDraft(draftId: string) {
    const scheduledFor = scheduleByDraft[draftId];
    if (!scheduledFor) {
      setError("Select a schedule date/time before moving to scheduling.");
      return;
    }

    setSavingId(draftId);
    setError(null);
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, scheduledFor }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to schedule draft");
      await refreshDrafts();
    } catch (scheduleError) {
      setError(scheduleError instanceof Error ? scheduleError.message : "Unknown error");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm">Loading drafts...</section>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Approval queue is in mock mode:</strong> data persists in-memory for this running app session.
      </section>

      {error ? (
        <section className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </section>
      ) : null}

      {drafts.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No drafts yet.</section>
      ) : (
        <section className="space-y-3">
          {drafts.map((draft) => (
            <article key={draft.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{draft.topic}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{draft.platform.toUpperCase()}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{draft.status}</span>
              </div>

              <textarea
                value={draft.text}
                onChange={(event) =>
                  setDrafts((prev) =>
                    prev.map((item) => (item.id === draft.id ? { ...item, text: event.target.value } : item)),
                  )
                }
                className="mt-3 min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm"
              />

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => updateDraft(draft.id, { status: "approved", text: draft.text })}
                  disabled={savingId === draft.id}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-white disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateDraft(draft.id, { status: "pending_approval", text: draft.text })}
                  disabled={savingId === draft.id}
                  className="rounded-md border border-slate-300 px-3 py-1.5 disabled:opacity-50"
                >
                  Save Edit
                </button>
                <button
                  type="button"
                  onClick={() => updateDraft(draft.id, { status: "rejected" })}
                  disabled={savingId === draft.id}
                  className="rounded-md bg-rose-600 px-3 py-1.5 text-white disabled:opacity-50"
                >
                  Reject
                </button>
              </div>

              <div className="mt-3 grid gap-2 md:max-w-sm">
                <label className="text-xs text-slate-600" htmlFor={`schedule-${draft.id}`}>
                  Move to scheduling
                </label>
                <input
                  id={`schedule-${draft.id}`}
                  type="datetime-local"
                  value={scheduleByDraft[draft.id] || ""}
                  onChange={(event) => setScheduleByDraft((prev) => ({ ...prev, [draft.id]: event.target.value }))}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => scheduleDraft(draft.id)}
                  disabled={savingId === draft.id}
                  className="w-fit rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  Move to scheduling
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
