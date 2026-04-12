import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("Next.js security headers", () => {
  it("configures security headers", async () => {
    const headersConfig = nextConfig.headers;
    expect(headersConfig).toBeDefined();

    const headerGroups = await headersConfig!();
    const global = headerGroups.find((h: { source: string }) => h.source === "/(.*)")!;
    expect(global).toBeDefined();

    const headerMap = Object.fromEntries(
      global.headers.map((h: { key: string; value: string }) => [h.key, h.value]),
    );

    expect(headerMap["X-Frame-Options"]).toBe("DENY");
    expect(headerMap["X-Content-Type-Options"]).toBe("nosniff");
    expect(headerMap["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headerMap["X-DNS-Prefetch-Control"]).toBe("on");
    expect(headerMap["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
  });
});
