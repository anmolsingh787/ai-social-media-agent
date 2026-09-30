import { GeneratePostInput, GeneratedVariant, Platform } from "@/lib/models";

const languageIntro: Record<GeneratePostInput["language"], string> = {
  english: "Here is a practical insight",
  hindi: "Yeh ek practical insight hai",
  hinglish: "Yeh ek practical insight hai jo aapke audience ko connect karega",
};

const toneSuffix: Record<GeneratePostInput["tone"], string> = {
  professional: "with a clear business outcome.",
  casual: "in a simple and relatable way.",
  "thought-leadership": "that positions your brand as a category leader.",
  promotional: "to encourage action and conversions.",
};

function hashInput(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createText(platform: Platform, input: GeneratePostInput): string {
  const marker = hashInput(`${input.topic}:${platform}:${input.language}:${input.tone}`) % 97;
  const cta = platform === "linkedin" ? "What is your perspective?" : "What do you think?";
  const prefix = platform === "linkedin" ? "🔹" : "🚀";

  return `${prefix} ${languageIntro[input.language]} on ${input.topic}. This draft is tuned for ${platform.toUpperCase()} and ${input.tone} tone ${toneSuffix[input.tone]}\n\nKey idea #${marker}: Share one concrete example and one measurable takeaway.\n\n${cta}`;
}

function createHashtags(topic: string, platform: Platform): string[] {
  const base = topic
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => `#${word.replace(/[^a-zA-Z0-9]/g, "")}`)
    .filter((tag) => tag.length > 1);

  const platformTag = platform === "linkedin" ? "#LinkedInTips" : "#BuildInPublic";
  return Array.from(new Set([...base, "#AISocialAgent", platformTag]));
}

export function generateDeterministicMockContent(input: GeneratePostInput): GeneratedVariant[] {
  return input.platforms.map((platform) => {
    const text = createText(platform, input);
    const hashtags = createHashtags(input.topic, platform);

    return {
      platform,
      text,
      hashtags,
      charCount: text.length,
    };
  });
}
