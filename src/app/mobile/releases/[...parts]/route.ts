import { readFile } from "node:fs/promises";
import { join } from "node:path";

const safePart = /^[A-Za-z0-9._+-]+$/;
const channels = new Set(["stable", "beta", "internal"]);
const platforms = new Set(["android", "ios"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ parts: string[] }> }
) {
  const { parts } = await context.params;
  if (parts.length !== 3) {
    return Response.json({ code: "INVALID_RELEASE_TARGET" }, { status: 400 });
  }
  const [platform, channel, currentVersion] = parts;
  if (!platforms.has(platform) || !channels.has(channel) || !safePart.test(currentVersion) || currentVersion.includes("..")) {
    return Response.json({ code: "INVALID_RELEASE_TARGET" }, { status: 400 });
  }

  try {
    const manifest = await readFile(join(process.cwd(), "download", platform, channel, "latest.json"), "utf8");
    return new Response(manifest, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  } catch {
    return new Response(null, { status: 204 });
  }
}
