export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-slate-600">Global defaults and future production configuration.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <form className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Default language
            <select className="rounded-md border border-slate-300 px-2 py-2" defaultValue="english">
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Default approval mode
            <select className="rounded-md border border-slate-300 px-2 py-2" defaultValue="approval_required">
              <option value="approval_required">Approval required</option>
              <option value="save_draft">Save draft</option>
              <option value="schedule">Schedule</option>
              <option value="publish_later">Publish later</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm md:col-span-2">
            Brand voice notes
            <textarea className="min-h-24 rounded-md border border-slate-300 px-3 py-2" placeholder="Add audience, messaging pillars, and compliance notes..." />
          </label>

          <button type="button" className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
            Save settings (placeholder)
          </button>
        </form>
      </section>
    </div>
  );
}
