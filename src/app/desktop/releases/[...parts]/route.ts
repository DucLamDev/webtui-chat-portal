import { readFile } from "node:fs/promises";
import { join } from "node:path";

const safePart = /^[A-Za-z0-9._+-]+$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ parts: string[] }> }
) {
  const { parts } = await context.params;
  if (
    parts.length !== 4 ||
    !["stable", "beta"].includes(parts[0]) ||
    parts.some((part) => !safePart.test(part) || part.includes(".."))
  ) {
    return Response.json({ code: "INVALID_RELEASE_TARGET" }, { status: 400 });
  }
  const [channel, target, arch] = parts;
  try {
    const manifest = await readFile(join(process.cwd(), "download", "desktop", channel, target, arch, "latest.json"), "utf8");
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
