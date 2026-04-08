import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type VercelHeader = {
  key: string;
  value: string;
};

type VercelConfig = {
  buildCommand?: string;
  outputDirectory?: string;
  rewrites?: Array<{ source: string; destination: string }>;
  headers?: Array<{ source: string; headers: VercelHeader[] }>;
  functions?: unknown;
};

function loadVercelConfig(): VercelConfig {
  const vercelConfigPath = path.resolve(process.cwd(), "vercel.json");
  const fileContent = readFileSync(vercelConfigPath, "utf-8");
  return JSON.parse(fileContent) as VercelConfig;
}

describe("vercel deployment configuration", () => {
  it("uses dist as static output and keeps the build command explicit", () => {
    const config = loadVercelConfig();

    expect(config.buildCommand).toBe("npm run build");
    expect(config.outputDirectory).toBe("dist");
  });

  it("serves the SPA via index fallback rewrite", () => {
    const config = loadVercelConfig();
    expect(config.rewrites).toContainEqual({
      source: "/(.*)",
      destination: "/index.html"
    });
  });

  it("defines mandatory security headers", () => {
    const config = loadVercelConfig();
    const allHeaders = (config.headers ?? []).flatMap((entry) => entry.headers);
    const securityHeaderKeys = new Set(allHeaders.map((header) => header.key));

    expect(securityHeaderKeys.has("Content-Security-Policy")).toBe(true);
    expect(securityHeaderKeys.has("Referrer-Policy")).toBe(true);
    expect(securityHeaderKeys.has("X-Content-Type-Options")).toBe(true);
  });

  it("allows local media assets through explicit media-src directive", () => {
    const config = loadVercelConfig();
    const allHeaders = (config.headers ?? []).flatMap((entry) => entry.headers);
    const contentSecurityPolicy = allHeaders.find(
      (header) => header.key === "Content-Security-Policy"
    )?.value;

    expect(contentSecurityPolicy).toBeDefined();
    expect(contentSecurityPolicy).toContain("media-src 'self'");
  });

  it("keeps required CSP directives for telegram preview and local assets", () => {
    const config = loadVercelConfig();
    const allHeaders = (config.headers ?? []).flatMap((entry) => entry.headers);
    const contentSecurityPolicy = allHeaders.find(
      (header) => header.key === "Content-Security-Policy"
    )?.value;

    expect(contentSecurityPolicy).toBeDefined();
    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("script-src 'self' https://telegram.org");
    expect(contentSecurityPolicy).toContain("img-src 'self' data: https://telegram.org");
    expect(contentSecurityPolicy).toContain("media-src 'self'");
    expect(contentSecurityPolicy).toContain("connect-src 'self' https://telegram.org https://*.telegram.org");
    expect(contentSecurityPolicy).toContain("frame-src https://*.telegram.org");
    expect(contentSecurityPolicy).toContain(
      "frame-ancestors https://web.telegram.org https://*.telegram.org"
    );
  });

  it("does not rely on server runtime functions", () => {
    const config = loadVercelConfig();
    expect(config.functions).toBeUndefined();
  });
});
