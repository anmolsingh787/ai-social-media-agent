export default function AccountsPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Connected Accounts</h2>
        <p className="mt-1 text-sm text-slate-600">OAuth/API placeholders for LinkedIn and X. No publishing is active without valid credentials.</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">LinkedIn</h3>
          <p className="mt-2 text-sm text-slate-600">Configure LinkedIn OAuth, organization/user URN mapping, and refresh token storage.</p>
          <button className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm">Connect LinkedIn (placeholder)</button>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold">X</h3>
          <p className="mt-2 text-sm text-slate-600">Configure X API app keys, OAuth callback, and token rotation flow.</p>
          <button className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm">Connect X (placeholder)</button>
        </article>
      </section>
    </div>
  );
}
