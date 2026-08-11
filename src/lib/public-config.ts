export type PublicComplianceConfig = {
  accountDeletionDays: number;
  androidPackageName: "com.vpsttt.webtui_chat";
  appLinkOrigin: string;
  appleAppId: string | null;
  appleBundleId: string | null;
  appleTeamId: string | null;
  desktopDownloadUrl: string;
  documentationUrl: string;
  enableIosAssociation: boolean;
  legalAddress: string;
  legalCountry: string;
  legalEntityName: string;
  mobileDownloadUrl: string;
  moderationEvidenceRetentionDays: number;
  playSigningFingerprints: string[];
  policyEffectiveDate: string;
  policyVersion: string;
  portalBasePath: string;
  portalOrigin: string;
  privacyEmail: string;
  safetyEmail: string;
  supportEmail: string;
  supportResponseHours: number;
  ugcReportResponseHours: number;
};

const androidPackageName = "com.vpsttt.webtui_chat" as const;
export const currentPolicyVersion = "2026-08-07";
const placeholderPattern =
  /(?:change[ _-]?me|todo|tbd|placeholder|example\.(?:com|org|net)|your[ _-](?:company|name|address)|<[^>]+>)/i;
const fingerprintPattern = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const appleBundleIdPattern =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

export function readPublicComplianceConfig(
  env: NodeJS.ProcessEnv = process.env,
): PublicComplianceConfig {
  const errors: string[] = [];
  const text = (name: string, minimumLength = 1) => {
    const value = env[name]?.trim() ?? "";
    if (
      !value ||
      value.length < minimumLength ||
      placeholderPattern.test(value)
    ) {
      errors.push(
        `${name} phải là giá trị production thực, không được để trống/placeholder.`,
      );
    }
    return value;
  };
  const email = (name: string) => {
    const value = text(name);
    if (value && !emailPattern.test(value)) {
      errors.push(`${name} phải là địa chỉ email hợp lệ.`);
    }
    return value;
  };
  const positiveInteger = (name: string, maximum: number) => {
    const raw = text(name);
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0 || value > maximum) {
      errors.push(`${name} phải là số nguyên từ 1 đến ${maximum}.`);
    }
    return value;
  };
  const boolean = (name: string, defaultValue: boolean) => {
    const raw = env[name]?.trim().toLowerCase();
    if (!raw) {
      return defaultValue;
    }
    if (raw !== "true" && raw !== "false") {
      errors.push(`${name} phải là true hoặc false.`);
    }
    return raw === "true";
  };
  const httpsOrigin = (name: string) => {
    const value = text(name);
    try {
      const parsed = new URL(value);
      if (
        parsed.protocol !== "https:" ||
        parsed.username ||
        parsed.password ||
        parsed.pathname !== "/" ||
        parsed.search ||
        parsed.hash
      ) {
        throw new Error("invalid origin");
      }
      return parsed.origin;
    } catch {
      errors.push(
        `${name} phải là HTTPS origin, ví dụ https://download.company.com.`,
      );
      return value;
    }
  };
  const publicHttpsUrl = (name: string, publicName: string) => {
    const value = (env[publicName]?.trim() || env[name]?.trim()) ?? "";
    if (!value || placeholderPattern.test(value)) {
      errors.push(
        `${name} phải là HTTPS URL production thực, không được để trống/placeholder.`,
      );
      return value;
    }
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
        throw new Error("invalid URL");
      }
      return parsed.toString();
    } catch {
      errors.push(`${name} phải là HTTPS URL hợp lệ.`);
      return value;
    }
  };

  const portalBasePath = env.NEXT_PUBLIC_PORTAL_BASE_PATH?.trim() ?? "";
  if (portalBasePath && !/^\/[a-z0-9/_-]*[a-z0-9_-]$/i.test(portalBasePath)) {
    errors.push(
      "NEXT_PUBLIC_PORTAL_BASE_PATH phải để trống hoặc là path bắt đầu bằng /, không có dấu / cuối.",
    );
  }

  const policyEffectiveDate = text("POLICY_EFFECTIVE_DATE");
  const parsedPolicyDate = new Date(`${policyEffectiveDate}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(policyEffectiveDate) ||
    Number.isNaN(parsedPolicyDate.getTime()) ||
    parsedPolicyDate.toISOString().slice(0, 10) !== policyEffectiveDate
  ) {
    errors.push(
      "POLICY_EFFECTIVE_DATE phải theo định dạng YYYY-MM-DD và là ngày hợp lệ.",
    );
  }
  const policyVersion = text("POLICY_VERSION");
  if (policyVersion && policyVersion !== currentPolicyVersion) {
    errors.push(
      `POLICY_VERSION phải là ${currentPolicyVersion} để khớp legal document version mà backend/mobile ghi nhận.`,
    );
  }

  const rawFingerprints = text("PLAY_APP_SIGNING_SHA256_FINGERPRINTS");
  const playSigningFingerprints = rawFingerprints
    .split(/[,;\n]+/)
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  if (
    playSigningFingerprints.length === 0 ||
    playSigningFingerprints.some((value) => !fingerprintPattern.test(value))
  ) {
    errors.push(
      "PLAY_APP_SIGNING_SHA256_FINGERPRINTS phải chứa SHA-256 của Play App Signing (32 cặp hex phân cách bằng dấu :).",
    );
  }

  const enableIosAssociation = boolean("ENABLE_IOS_ASSOCIATION", false);
  const rawAppleTeamId = env.APPLE_TEAM_ID?.trim() ?? "";
  const rawAppleBundleId = env.APPLE_BUNDLE_ID?.trim() ?? "";
  let appleTeamId: string | null = null;
  let appleBundleId: string | null = null;
  let appleAppId: string | null = null;

  if (enableIosAssociation) {
    appleTeamId = text("APPLE_TEAM_ID");
    appleBundleId = text("APPLE_BUNDLE_ID");
    if (appleTeamId && !/^[A-Z0-9]{10}$/.test(appleTeamId)) {
      errors.push(
        "APPLE_TEAM_ID phải gồm đúng 10 ký tự chữ hoa/số từ Apple Developer.",
      );
    }
    if (appleBundleId && !appleBundleIdPattern.test(appleBundleId)) {
      errors.push("APPLE_BUNDLE_ID phải là bundle ID reverse-DNS hợp lệ.");
    }
    if (appleTeamId && appleBundleId) {
      appleAppId = `${appleTeamId}.${appleBundleId}`;
    }
  } else if (rawAppleTeamId || rawAppleBundleId) {
    errors.push(
      "Khi ENABLE_IOS_ASSOCIATION=false, APPLE_TEAM_ID và APPLE_BUNDLE_ID phải để trống; bật cờ chỉ sau khi có Apple identity thật.",
    );
  }

  const config: PublicComplianceConfig = {
    accountDeletionDays: positiveInteger(
      "ACCOUNT_DELETION_COMPLETION_DAYS",
      90,
    ),
    androidPackageName,
    appLinkOrigin: httpsOrigin("APP_LINK_ORIGIN"),
    appleAppId,
    appleBundleId,
    appleTeamId,
    desktopDownloadUrl: publicHttpsUrl(
      "DESKTOP_DOWNLOAD_URL",
      "NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL",
    ),
    documentationUrl: publicHttpsUrl(
      "DOCUMENTATION_URL",
      "NEXT_PUBLIC_DOCUMENTATION_URL",
    ),
    enableIosAssociation,
    legalAddress: text("LEGAL_ENTITY_ADDRESS", 8),
    legalCountry: text("LEGAL_ENTITY_COUNTRY", 2),
    legalEntityName: text("LEGAL_ENTITY_NAME", 2),
    mobileDownloadUrl: publicHttpsUrl(
      "MOBILE_DOWNLOAD_URL",
      "NEXT_PUBLIC_MOBILE_DOWNLOAD_URL",
    ),
    moderationEvidenceRetentionDays: positiveInteger(
      "MODERATION_EVIDENCE_RETENTION_DAYS",
      3650,
    ),
    playSigningFingerprints: [...new Set(playSigningFingerprints)],
    policyEffectiveDate,
    policyVersion,
    portalBasePath,
    portalOrigin: httpsOrigin("PORTAL_ORIGIN"),
    privacyEmail: email("PRIVACY_CONTACT_EMAIL"),
    safetyEmail: email("SAFETY_CONTACT_EMAIL"),
    supportEmail: email("SUPPORT_EMAIL"),
    supportResponseHours: positiveInteger("SUPPORT_RESPONSE_HOURS", 720),
    ugcReportResponseHours: positiveInteger("UGC_REPORT_RESPONSE_HOURS", 720),
  };

  if (errors.length) {
    throw new Error(
      `Cấu hình public/store compliance chưa hợp lệ:\n- ${errors.join("\n- ")}`,
    );
  }

  return config;
}

export function portalPath(config: PublicComplianceConfig, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${config.portalBasePath}${normalizedPath}` || "/";
}

export function portalUrl(config: PublicComplianceConfig, path: string) {
  return new URL(
    portalPath(config, path),
    `${config.portalOrigin}/`,
  ).toString();
}
