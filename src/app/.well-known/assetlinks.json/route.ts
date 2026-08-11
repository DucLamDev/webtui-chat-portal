import { buildAndroidAssetLinks } from "@/lib/app-associations";
import { readPublicComplianceConfig } from "@/lib/public-config";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return Response.json(buildAndroidAssetLinks(readPublicComplianceConfig()), {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}
