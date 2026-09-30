import { GeneratePostInput, Platform } from "@/lib/models";

const allowedPlatforms: Platform[] = ["linkedin", "x"];

export function validateGenerateInput(payload: unknown): { valid: true; data: GeneratePostInput } | { valid: false; error: string } {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid payload." };
  }

  const data = payload as Partial<GeneratePostInput>;

  if (!data.topic || data.topic.trim().length < 3) {
    return { valid: false, error: "Topic must be at least 3 characters long." };
  }

  if (!Array.isArray(data.platforms) || data.platforms.length === 0) {
    return { valid: false, error: "Select at least one platform." };
  }

  if (!data.platforms.every((platform) => allowedPlatforms.includes(platform))) {
    return { valid: false, error: "Unsupported platform selected." };
  }

  if (!data.language || !["english", "hindi", "hinglish"].includes(data.language)) {
    return { valid: false, error: "Unsupported language." };
  }

  if (!data.tone || !["professional", "casual", "thought-leadership", "promotional"].includes(data.tone)) {
    return { valid: false, error: "Unsupported tone." };
  }

  if (!data.publishMode || !["save_draft", "approval_required", "schedule", "publish_later"].includes(data.publishMode)) {
    return { valid: false, error: "Unsupported publish mode." };
  }

  return {
    valid: true,
    data: {
      topic: data.topic.trim(),
      platforms: data.platforms,
      language: data.language,
      tone: data.tone,
      publishMode: data.publishMode,
    },
  };
}

export function validateScheduleDateTime(value: string): { valid: true } | { valid: false; error: string } {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    return { valid: false, error: "Provide a valid date and time." };
  }

  if (date.getTime() < Date.now()) {
    return { valid: false, error: "Scheduled time must be in the future." };
  }

  return { valid: true };
}
