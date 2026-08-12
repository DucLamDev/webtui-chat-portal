import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildAndroidAssetLinks,
  buildAppleAppSiteAssociation,
} from "../../src/lib/app-associations";
import {
  portalUrl,
  readPublicComplianceConfig,
} from "../../src/lib/public-config";

const playFingerprint = Array.from({ length: 32 }, (_, index) =>
  index.toString(16).padStart(2, "0"),
)
  .join(":")
  .toUpperCase();

function productionFixture(): NodeJS.ProcessEnv {
  return {
    ACCOUNT_DELETION_COMPLETION_DAYS: "30",
    APP_LINK_ORIGIN: "https://chat.vpsttt.com",
    DESKTOP_DOWNLOAD_URL: "https://download.webtui.vn/download/",
    DOCUMENTATION_URL: "https://download.webtui.vn/docs/",
    ENABLE_IOS_ASSOCIATION: "false",
    LEGAL_ENTITY_ADDRESS: "123 Production Street, District 1",
    LEGAL_ENTITY_COUNTRY: "Việt Nam",
    LEGAL_ENTITY_NAME: "VPSTTT Technology Company",
    MOBILE_DOWNLOAD_URL:
      "https://play.google.com/store/apps/details?id=com.vpsttt.webtui_chat",
    MODERATION_EVIDENCE_RETENTION_DAYS: "365",
    NEXT_PUBLIC_PORTAL_BASE_PATH: "",
    PLAY_APP_SIGNING_SHA256_FINGERPRINTS: playFingerprint.toLowerCase(),
    POLICY_EFFECTIVE_DATE: "2026-08-07",
    POLICY_VERSION: "2026-08-07",
    PORTAL_ORIGIN: "https://download.webtui.vn",
    PRIVACY_CONTACT_EMAIL: "lienhe@vpsttt.com",
    SAFETY_CONTACT_EMAIL: "lienhe@vpsttt.com",
    SUPPORT_EMAIL: "lienhe@vpsttt.com",
    SUPPORT_RESPONSE_HOURS: "72",
    UGC_REPORT_RESPONSE_HOURS: "72",
  };
}

function sourceFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

describe("public/store compliance configuration", () => {
  it("keeps the generated Play upload set within current asset contracts", () => {
    const manifest = JSON.parse(
      sourceFile("store-assets/play/manifest.json"),
    ) as {
      outputs: Record<
        string,
        { alpha: boolean; height: number; width: number }
      >;
    };

    expect(manifest.outputs["store-assets/play/icon-512.png"]).toMatchObject({
      alpha: true,
      height: 512,
      width: 512,
    });
    expect(
      Object.keys(manifest.outputs).some((path) => path.includes("/tablet/")),
    ).toBe(false);
    expect(
      existsSync(
        new URL(
          "../../store-assets/play/tablet/01-chat-1024x768.png",
          import.meta.url,
        ),
      ),
    ).toBe(false);
  });

  it("normalizes production configuration and canonical URLs", () => {
    const config = readPublicComplianceConfig(productionFixture());

    expect(config.androidPackageName).toBe("com.vpsttt.webtui_chat");
    expect(config.enableIosAssociation).toBe(false);
    expect(config.appleAppId).toBeNull();
    expect(config.appleBundleId).toBeNull();
    expect(config.appleTeamId).toBeNull();
    expect(config.playSigningFingerprints).toEqual([playFingerprint]);
    expect(config.moderationEvidenceRetentionDays).toBe(365);
    expect(portalUrl(config, "/privacy")).toBe(
      "https://download.webtui.vn/privacy",
    );
  });

  it("fails closed when legal identity or deletion SLA is invalid", () => {
    const env = productionFixture();
    env.LEGAL_ENTITY_NAME = "CHANGE_ME_LEGAL_ENTITY_NAME";
    env.ACCOUNT_DELETION_COMPLETION_DAYS = "0";
    env.MODERATION_EVIDENCE_RETENTION_DAYS = "0";

    expect(() => readPublicComplianceConfig(env)).toThrow(/LEGAL_ENTITY_NAME/);
    expect(() => readPublicComplianceConfig(env)).toThrow(
      /ACCOUNT_DELETION_COMPLETION_DAYS/,
    );
    expect(() => readPublicComplianceConfig(env)).toThrow(
      /MODERATION_EVIDENCE_RETENTION_DAYS/,
    );
  });

  it("rejects malformed association configuration", () => {
    const env = productionFixture();
    env.PLAY_APP_SIGNING_SHA256_FINGERPRINTS = "AA:BB";
    env.ENABLE_IOS_ASSOCIATION = "true";
    env.APPLE_BUNDLE_ID = "not a bundle";
    env.APPLE_TEAM_ID = "short";

    expect(() => readPublicComplianceConfig(env)).toThrow(/PLAY_APP_SIGNING/);
    expect(() => readPublicComplianceConfig(env)).toThrow(/APPLE_TEAM_ID/);
    expect(() => readPublicComplianceConfig(env)).toThrow(/APPLE_BUNDLE_ID/);
  });

  it("requires an explicit, complete Apple identity only when iOS association is enabled", () => {
    const safeDefault = productionFixture();
    delete safeDefault.ENABLE_IOS_ASSOCIATION;
    expect(readPublicComplianceConfig(safeDefault).enableIosAssociation).toBe(
      false,
    );

    const missingIdentity = productionFixture();
    missingIdentity.ENABLE_IOS_ASSOCIATION = "true";

    expect(() => readPublicComplianceConfig(missingIdentity)).toThrow(
      /APPLE_TEAM_ID/,
    );
    expect(() => readPublicComplianceConfig(missingIdentity)).toThrow(
      /APPLE_BUNDLE_ID/,
    );

    const disabledWithIdentity = productionFixture();
    disabledWithIdentity.APPLE_TEAM_ID = "ABCDE12345";
    disabledWithIdentity.APPLE_BUNDLE_ID = "com.vpsttt.webtuiChat";

    expect(() => readPublicComplianceConfig(disabledWithIdentity)).toThrow(
      /phải để trống/,
    );

    const invalidFlag = productionFixture();
    invalidFlag.ENABLE_IOS_ASSOCIATION = "yes";
    expect(() => readPublicComplianceConfig(invalidFlag)).toThrow(
      /ENABLE_IOS_ASSOCIATION/,
    );
  });

  it("rejects a calendar date that JavaScript would silently normalize", () => {
    const env = productionFixture();
    env.POLICY_EFFECTIVE_DATE = "2026-02-30";

    expect(() => readPublicComplianceConfig(env)).toThrow(
      /POLICY_EFFECTIVE_DATE/,
    );
  });

  it("rejects a legal document version that backend/mobile would not recognize", () => {
    const env = productionFixture();
    env.POLICY_VERSION = "1.0";

    expect(() => readPublicComplianceConfig(env)).toThrow(/2026-08-07/);
  });

  it("rejects an insecure or missing public release URL", () => {
    const env = productionFixture();
    env.MOBILE_DOWNLOAD_URL = "http://download.webtui.vn/app.apk";
    delete env.DOCUMENTATION_URL;

    expect(() => readPublicComplianceConfig(env)).toThrow(
      /MOBILE_DOWNLOAD_URL/,
    );
    expect(() => readPublicComplianceConfig(env)).toThrow(/DOCUMENTATION_URL/);
  });

  it("keeps direct Android distribution fail-closed until the Play signer matches", () => {
    const downloadScript = sourceFile("download/app.js");
    const manifest = JSON.parse(
      sourceFile("download/android/stable/mobile-release-manifest.json"),
    ) as Record<string, unknown>;
    const caddyfile = sourceFile("deploy/Caddyfile");
    const dockerfile = sourceFile("Dockerfile");

    expect(downloadScript).toContain("signer === playSigner");
    expect(downloadScript).toContain("checksum.length === 64");
    expect(downloadScript).not.toContain(
      'download_url: "/downloads/files/android/stable/app-prod-release.apk"',
    );
    expect(manifest.download_url).toBe("");
    expect(manifest.checksum_sha256).toBe("");
    expect(manifest.signer_sha256).toBe("");
    expect(caddyfile).toContain("respond /download/dev-download.html 404");
    expect(dockerfile).toMatch(/^ARG NEXT_PUBLIC_MOBILE_DOWNLOAD_URL\r?$/m);
    expect(dockerfile).not.toContain(
      "ARG NEXT_PUBLIC_MOBILE_DOWNLOAD_URL=https://download.webtui.vn/download/",
    );
  });

  it("always renders Android association and refuses AASA in Play-only mode", () => {
    const config = readPublicComplianceConfig(productionFixture());

    expect(buildAndroidAssetLinks(config)).toEqual([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.vpsttt.webtui_chat",
          sha256_cert_fingerprints: [playFingerprint],
        },
      },
    ]);
    expect(() => buildAppleAppSiteAssociation(config)).toThrow(
      /ENABLE_IOS_ASSOCIATION/,
    );
  });

  it("renders the exact AASA identity after iOS association is enabled", () => {
    const env = productionFixture();
    env.ENABLE_IOS_ASSOCIATION = "true";
    env.APPLE_TEAM_ID = "ABCDE12345";
    env.APPLE_BUNDLE_ID = "com.vpsttt.webtuiChat";
    const config = readPublicComplianceConfig(env);

    expect(config.appleAppId).toBe("ABCDE12345.com.vpsttt.webtuiChat");
    expect(buildAppleAppSiteAssociation(config)).toEqual({
      applinks: {
        details: [
          {
            appIDs: ["ABCDE12345.com.vpsttt.webtuiChat"],
            components: [
              {
                "/": "/conversations",
                comment: "Mở danh sách hội thoại trong WebTUI Chat",
              },
              {
                "/": "/conversations/*",
                comment: "Mở hội thoại trong WebTUI Chat",
              },
              {
                "/": "/notifications",
                comment: "Mở danh sách thông báo trong WebTUI Chat",
              },
            ],
          },
        ],
      },
    });
  });
});
