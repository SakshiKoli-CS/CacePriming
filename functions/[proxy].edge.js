/**
 * Contentstack Launch Edge Function
 * File: functions/[proxy].edge.js
 *
 * Simulates domain-specific URL availability to test cache priming behaviour
 * when some domains return 404 for certain URLs.
 *
 * launch.json has /test/page-1 to /test/page-981 (981 test pages total).
 *
 * Tier 1 — domain-1  to domain-25 : pages 1–981  → 200          (all available)
 * Tier 2 — domain-26 to domain-50 : pages 1–500  → 200          (pages 501–981 → 404)
 * Tier 3 — domain-51 to domain-75 : pages 1–250  → 200          (pages 251–981 → 404)
 *
 * All other routes are passed through to the origin unchanged.
 */

const TIERS = [
  { min: 1,  max: 25, limit: 981 },
  { min: 26, max: 50, limit: 500 },
  { min: 51, max: 75, limit: 250 },
];

function getDomainNum(host) {
  const match = (host || "").match(/domain-(\d+)\./);
  return match ? parseInt(match[1], 10) : null;
}

function getPageLimit(domainNum) {
  if (domainNum === null) return null;
  const tier = TIERS.find((t) => domainNum >= t.min && domainNum <= t.max);
  return tier ? tier.limit : null;
}

export default function handler(request, context) {
  const url       = new URL(request.url);
  const host      = request.headers.get("host") || "";
  const domainNum = getDomainNum(host);
  const pageLimit = getPageLimit(domainNum);

  // Only intercept /test/page-N routes
  const testMatch = url.pathname.match(/^\/test\/page-(\d+)$/);

  if (testMatch && pageLimit !== null) {
    const pageNum = parseInt(testMatch[1], 10);

    if (pageNum > pageLimit) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          reason: `domain-${domainNum} only serves pages 1–${pageLimit}. Page ${pageNum} does not exist on this domain.`,
          domain: host,
          page: pageNum,
          limit: pageLimit,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "x-cache-prime-skip": "true",
          },
        }
      );
    }
  }

  // All other requests — forward to origin through CDN cache layer
  return fetch(request);
}
