"use client";

import { FormEvent, useMemo, useState } from "react";

import { GeneratePostInput, GeneratedVariant, Platform } from "@/lib/models";

const platformLimits: Record<Platform, number> = { linkedin: 3000, x: 280 };

const defaultInput: GeneratePostInput = {
  topic: "",
  platforms: ["linkedin", "x"],
  language: "english",
  tone: "professional",
  publishMode: "approval_required",
};

export default function CreatePostPage() {
  const [form, setForm] = useState<GeneratePostInput>(defaultInput);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => form.topic.trim().length >= 3 && form.platforms.length > 0, [form]);

  async function generate(input: GeneratePostInput) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content.");
      }

      setVariants(data.variants);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await generate(form);
  }

  function togglePlatform(platform: Platform) {
    setForm((prev) => {
      const has = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: has ? prev.platforms.filter((item) => item !== platform) : [...prev.platforms, platform],
      };
    });
  }

  async function regeneratePlatform(platform: Platform) {
    await generate({ ...form, platforms: [platform] });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Create Post</h2>
        <p className="mt-1 text-sm text-slate-600">Generate editable LinkedIn and X variants from one topic/prompt.</p>

        <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm">
            Topic / Prompt
            <textarea
              value={form.topic}
              onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
              className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
              placeholder="Example: Share 3 lessons from launching a product beta"
              required
            />
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Platforms</legend>
            <div className="flex flex-wrap gap-3 text-sm">
              {(["linkedin", "x"] as Platform[]).map((platform) => (
                <label key={platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.platforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                  />
                  {platform.toUpperCase()}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1 text-sm">
              Language
              <select
                className="rounded-md border border-slate-300 px-2 py-2"
                value={form.language}
                onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value as GeneratePostInput["language"] }))}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Tone
              <select
                className="rounded-md border border-slate-300 px-2 py-2"
                value={form.tone}
                onChange={(event) => setForm((prev) => ({ ...prev, tone: event.target.value as GeneratePostInput["tone"] }))}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="thought-leadership">Thought Leadership</option>
                <option value="promotional">Promotional</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              Publish mode
              <select
                className="rounded-md border border-slate-300 px-2 py-2"
                value={form.publishMode}
                onChange={(event) => setForm((prev) => ({ ...prev, publishMode: event.target.value as GeneratePostInput["publishMode"] }))}
              >
                <option value="save_draft">Save draft</option>
                <option value="approval_required">Approval required</option>
                <option value="schedule">Schedule</option>
                <option value="publish_later">Publish later</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canGenerate || loading}
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Generating..." : "AI Generate"}
          </button>
        </form>
      </section>

      {error && (
        <section className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </section>
      )}

      {variants.length === 0 && !loading && !error ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Generated variants will appear here. Start by adding a topic and clicking <strong>AI Generate</strong>.
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {variants.map((variant) => {
          const limit = platformLimits[variant.platform];
          const overLimit = variant.text.length > limit;

          return (
            <article key={variant.platform} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{variant.platform === "linkedin" ? "LinkedIn variant" : "X variant"}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{variant.platform.toUpperCase()}</span>
              </div>

              <textarea
                value={variant.text}
                onChange={(event) =>
                  setVariants((prev) =>
                    prev.map((item) =>
                      item.platform === variant.platform
                        ? { ...item, text: event.target.value, charCount: event.target.value.length }
                        : item,
                    ),
                  )
                }
                className="mt-3 min-h-40 w-full rounded-md border border-slate-300 p-3 text-sm"
              />

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={overLimit ? "text-rose-600" : "text-slate-500"}>
                  {variant.text.length}/{limit} characters
                </span>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-2 py-1"
                  onClick={() => regeneratePlatform(variant.platform)}
                >
                  Regenerate
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-600">Hashtags: {variant.hashtags.join(" ")}</p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Preview</p>
                <div className="mt-2 rounded-md border border-slate-200 bg-white p-3 text-sm">
                  <p className="whitespace-pre-wrap">{variant.text}</p>
                  <p className="mt-2 text-xs text-sky-700">{variant.hashtags.join(" ")}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
