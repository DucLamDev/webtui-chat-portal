import { buildAppleAppSiteAssociation } from "@/lib/app-associations";
import { readPublicComplianceConfig } from "@/lib/public-config";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const config = readPublicComplianceConfig();
  if (!config.enableIosAssociation) {
    return new Response(null, {
      headers: {
        "Cache-Control": "no-store"
      },
      status: 404
    });
  }

  return Response.json(buildAppleAppSiteAssociation(config), {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}
