import { normalizeSiteUrl } from "@/lib/url";

export interface SuggestedSite {
  name: string;
  url: string;
  favicon?: string;
}

export const SUGGESTED_SITES: readonly SuggestedSite[] = [
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
    name: "Claude",
    url: "https://status.claude.com",
    favicon: "https://claude.ai",
  },
  {
    name: "OpenAI",
    url: "https://status.openai.com",
    favicon: "https://openai.com",
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
    url: "https://new.cloudflarestatus.com/api/v2/summary.json",
    favicon: "https://www.cloudflare.com",
  },
  {
    name: "Google AI Studio",
    url: "https://aistudio.google.com/status",
    favicon: "https://aistudio.google.com",
  },
  {
    name: "Mistral",
    url: "https://status.mistral.ai",
    favicon: "https://mistral.ai",
  },
  {
    name: "xAI",
    url: "https://status.x.ai",
    favicon: "https://x.ai",
  },
];

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

export function unusedSuggestedSites(
  monitoredUrls: readonly string[],
): SuggestedSite[] {
  const added = new Set(monitoredUrls.map(comparableUrl));
  return SUGGESTED_SITES.filter((site) => !added.has(comparableUrl(site.url)));
}
