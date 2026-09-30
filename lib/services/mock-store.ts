import { AnalyticsOverview, DraftPost, DraftStatus, GeneratePostInput, GeneratedVariant, ScheduledPost } from "@/lib/models";

const draftStore = new Map<string, DraftPost>();
const scheduledStore = new Map<string, ScheduledPost>();

const weeklyActivity: AnalyticsOverview["weeklyActivity"] = [
  { day: "Mon", drafts: 3, scheduled: 1, published: 1 },
  { day: "Tue", drafts: 2, scheduled: 2, published: 1 },
  { day: "Wed", drafts: 4, scheduled: 2, published: 2 },
  { day: "Thu", drafts: 2, scheduled: 3, published: 2 },
  { day: "Fri", drafts: 3, scheduled: 2, published: 3 },
  { day: "Sat", drafts: 1, scheduled: 1, published: 1 },
  { day: "Sun", drafts: 2, scheduled: 2, published: 2 },
];

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

(function seedInitialDrafts() {
  if (draftStore.size > 0) return;

  const now = new Date().toISOString();
  const initial: DraftPost[] = [
    {
      id: "draft_seed_linkedin",
      topic: "AI content consistency",
      platform: "linkedin",
      language: "english",
      tone: "professional",
      publishMode: "approval_required",
      text: "Consistency builds trust. Use a repeatable AI-assisted process to draft, review, and publish value-driven updates every week.",
      hashtags: ["#AISocialAgent", "#ContentStrategy"],
      status: "pending_approval",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "draft_seed_x",
      topic: "Founder updates",
      platform: "x",
      language: "hinglish",
      tone: "casual",
      publishMode: "save_draft",
      text: "Daily founder updates > random posting. Ek short insight + one metric = stronger audience trust.",
      hashtags: ["#BuildInPublic", "#AISocialAgent"],
      status: "draft",
      createdAt: now,
      updatedAt: now,
    },
  ];

  initial.forEach((draft) => draftStore.set(draft.id, draft));

  const scheduleId = "schedule_seed_1";
  scheduledStore.set(scheduleId, {
    id: scheduleId,
    draftId: "draft_seed_linkedin",
    platform: "linkedin",
    text: initial[0].text,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: "scheduled",
  });
})();

export function listDrafts(): DraftPost[] {
  return Array.from(draftStore.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createDraftsFromGenerated(input: GeneratePostInput, variants: GeneratedVariant[]): DraftPost[] {
  const status: DraftStatus = input.publishMode === "approval_required" ? "pending_approval" : "draft";

  const created = variants.map((variant) => {
    const now = new Date().toISOString();
    const draft: DraftPost = {
      id: createId("draft"),
      topic: input.topic,
      platform: variant.platform,
      language: input.language,
      tone: input.tone,
      publishMode: input.publishMode,
      text: variant.text,
      hashtags: variant.hashtags,
      status,
      createdAt: now,
      updatedAt: now,
    };

    draftStore.set(draft.id, draft);
    return draft;
  });

  return created;
}

export function updateDraft(id: string, updates: Partial<Pick<DraftPost, "status" | "text" | "hashtags" | "publishMode">>): DraftPost | null {
  const existing = draftStore.get(id);
  if (!existing) return null;

  const updated: DraftPost = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  draftStore.set(id, updated);
  return updated;
}

export function listScheduledPosts(): ScheduledPost[] {
  return Array.from(scheduledStore.values()).sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}

export function scheduleDraft(draftId: string, scheduledFor: string): ScheduledPost | null {
  const draft = draftStore.get(draftId);
  if (!draft) return null;

  const scheduled: ScheduledPost = {
    id: createId("schedule"),
    draftId,
    platform: draft.platform,
    text: draft.text,
    scheduledFor,
    status: "scheduled",
  };

  scheduledStore.set(scheduled.id, scheduled);
  draftStore.set(draft.id, {
    ...draft,
    status: "scheduled",
    updatedAt: new Date().toISOString(),
  });

  return scheduled;
}

export function getAnalyticsOverview(): AnalyticsOverview {
  const drafts = listDrafts();
  const scheduled = listScheduledPosts();

  const published = 8;
  const engagementRate = "5.8%";

  return {
    drafts: drafts.filter((draft) => draft.status !== "rejected").length,
    scheduled: scheduled.length,
    published,
    engagementRate,
    weeklyActivity,
    source: "mock",
  };
}
