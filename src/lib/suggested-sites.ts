import { normalizeSiteUrl } from "@/lib/url";

export type SuggestedSiteCategory = "infrastructure" | "ai";

export interface SuggestedSite {
  name: string;
  url: string;
  favicon?: string;
  category: SuggestedSiteCategory;
}

const INFRASTRUCTURE_SITES: readonly Omit<SuggestedSite, "category">[] = [
  {
    name: "GitHub",
    url: "https://www.githubstatus.com",
    favicon: "https://github.com",
  },
  {
    name: "AWS",
    url: "https://health.aws.amazon.com/health/status",
    favicon: "https://aws.amazon.com",
  },
  {
    name: "Vercel",
    url: "https://www.vercel-status.com",
    favicon: "https://vercel.com",
  },
  {
    name: "Railway",
    url: "https://status.railway.com",
    favicon: "https://railway.com",
  },
  {
    name: "Google Cloud",
    url: "https://status.cloud.google.com",
    favicon: "https://cloud.google.com",
  },
  {
    name: "Cloudflare",
    url: "https://www.cloudflarestatus.com",
    favicon: "https://www.cloudflare.com",
  },
];

const AI_SITES: readonly Omit<SuggestedSite, "category">[] = [
  {
    name: "OpenAI",
    url: "https://status.openai.com",
    favicon: "https://openai.com",
  },
  {
    name: "Claude",
    url: "https://status.claude.com",
    favicon: "https://claude.ai",
  },
  {
    name: "Google AI Studio",
    url: "https://aistudio.google.com/status",
    favicon: "https://aistudio.google.com",
  },
  {
    name: "xAI",
    url: "https://status.x.ai",
    favicon: "https://x.ai",
  },
  {
    name: "DeepSeek",
    url: "https://status.deepseek.com",
    favicon: "https://www.deepseek.com",
  },
  {
    name: "Moonshot AI",
    url: "https://status.moonshot.cn",
    favicon: "https://www.moonshot.cn",
  },
  {
    name: "MiniMax",
    url: "https://status.minimax.io",
    favicon: "https://www.minimax.io",
  },
  {
    name: "Mistral",
    url: "https://status.mistral.ai",
    favicon: "https://mistral.ai",
  },
  {
    name: "Cohere",
    url: "https://status.cohere.com",
    favicon: "https://cohere.com",
  },
  {
    name: "OpenRouter",
    url: "https://status.openrouter.ai",
    favicon: "https://openrouter.ai",
  },
  {
    name: "Groq",
    url: "https://groqstatus.com",
    favicon: "https://groq.com",
  },
  {
    name: "Together AI",
    url: "https://status.together.ai",
    favicon: "https://www.together.ai",
  },
  {
    name: "Fireworks AI",
    url: "https://status.fireworks.ai",
    favicon: "https://fireworks.ai",
  },
  {
    name: "Cerebras",
    url: "https://status.cerebras.ai",
    favicon: "https://www.cerebras.ai",
  },
  {
    name: "Replicate",
    url: "https://www.replicatestatus.com",
    favicon: "https://replicate.com",
  },
  {
    name: "Hugging Face",
    url: "https://status.huggingface.co",
    favicon: "https://huggingface.co",
  },
  {
    name: "Baseten",
    url: "https://status.baseten.co",
    favicon: "https://www.baseten.co",
  },
  {
    name: "ElevenLabs",
    url: "https://status.elevenlabs.io",
    favicon: "https://elevenlabs.io",
  },
  {
    name: "Stability AI",
    url: "https://status.stability.ai",
    favicon: "https://stability.ai",
  },
];

function withCategory(
  category: SuggestedSiteCategory,
  sites: readonly Omit<SuggestedSite, "category">[],
): SuggestedSite[] {
  return sites.map((site) => ({ ...site, category }));
}

export const SUGGESTED_SITES: readonly SuggestedSite[] = [
  ...withCategory("infrastructure", INFRASTRUCTURE_SITES),
  ...withCategory("ai", AI_SITES),
];

const SECTION_TITLES: Record<SuggestedSiteCategory, string> = {
  infrastructure: "Infrastructure",
  ai: "AI",
};

export interface SuggestedSiteSection {
  category: SuggestedSiteCategory;
  title: string;
  sites: SuggestedSite[];
}

export function unusedSuggestedSites(
  monitoredUrls: readonly string[],
): SuggestedSite[] {
  const added = new Set(monitoredUrls.map(comparableUrl));
  return SUGGESTED_SITES.filter((site) => !added.has(comparableUrl(site.url)));
}

export function unusedSuggestedSitesBySection(
  monitoredUrls: readonly string[],
): SuggestedSiteSection[] {
  const unused = unusedSuggestedSites(monitoredUrls);
  const grouped: Record<SuggestedSiteCategory, SuggestedSite[]> = {
    infrastructure: [],
    ai: [],
  };

  for (const site of unused) {
    switch (site.category) {
      case "infrastructure":
      case "ai":
        grouped[site.category].push(site);
        break;
      default: {
        const _exhaustive: never = site.category;
        throw new Error(`Unhandled suggested site category: ${_exhaustive}`);
      }
    }
  }

  return (Object.keys(SECTION_TITLES) as SuggestedSiteCategory[])
    .map((category) => ({
      category,
      title: SECTION_TITLES[category],
      sites: grouped[category],
    }))
    .filter((section) => section.sites.length > 0);
}

const DIRECT_IMAGE_PATTERN = /\.(png|ico|svg|jpe?g|webp)(\?|$)/i;

export function suggestedFaviconSource(site: SuggestedSite): string {
  const favicon = site.favicon ?? site.url;
  if (DIRECT_IMAGE_PATTERN.test(favicon)) {
    return favicon;
  }

  return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(favicon)}`;
}

function comparableUrl(url: string): string {
  try {
    return normalizeSiteUrl(url);
  } catch {
    return url;
  }
}
