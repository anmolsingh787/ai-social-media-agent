export type Platform = "linkedin" | "x";

export type PostLanguage = "english" | "hindi" | "hinglish";

export type PostTone = "professional" | "casual" | "thought-leadership" | "promotional";

export type PublishMode = "save_draft" | "approval_required" | "schedule" | "publish_later";

export type DraftStatus = "pending_approval" | "approved" | "rejected" | "scheduled" | "draft";

export interface GeneratePostInput {
  topic: string;
  platforms: Platform[];
  language: PostLanguage;
  tone: PostTone;
  publishMode: PublishMode;
}

export interface GeneratedVariant {
  platform: Platform;
  text: string;
  hashtags: string[];
  charCount: number;
}

export interface DraftPost {
  id: string;
  topic: string;
  platform: Platform;
  language: PostLanguage;
  tone: PostTone;
  publishMode: PublishMode;
  text: string;
  hashtags: string[];
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledPost {
  id: string;
  draftId: string;
  platform: Platform;
  text: string;
  scheduledFor: string;
  status: "scheduled";
}

export interface WeeklyActivityPoint {
  day: string;
  drafts: number;
  scheduled: number;
  published: number;
}

export interface AnalyticsOverview {
  drafts: number;
  scheduled: number;
  published: number;
  engagementRate: string;
  weeklyActivity: WeeklyActivityPoint[];
  source: "mock";
}
