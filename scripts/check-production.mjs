const portalOrigin = requiredHttpsOrigin("PORTAL_ORIGIN");
const appLinkOrigin = requiredHttpsOrigin("APP_LINK_ORIGIN");
const enableIosAssociation = optionalBoolean("ENABLE_IOS_ASSOCIATION", false);
const portalBasePath = (process.env.PORTAL_BASE_PATH ?? "").trim();
if (portalBasePath && !/^\/[a-z0-9/_-]*[a-z0-9_-]$/i.test(portalBasePath)) {
  fail("PORTAL_BASE_PATH phải để trống hoặc là path bắt đầu bằng / và không có / cuối.");
}
const expectedFingerprint = required("PLAY_APP_SIGNING_SHA256_FINGERPRINTS")
  .split(/[,;\n]+/)
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean);
if (
  expectedFingerprint.length === 0 ||
  expectedFingerprint.some(
    (value) => !/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(value)
  )
) {
  fail(
    "PLAY_APP_SIGNING_SHA256_FINGERPRINTS phải chứa SHA-256 Play App Signing hợp lệ."
  );
}
const rawAppleTeamId = process.env.APPLE_TEAM_ID?.trim() ?? "";
const rawAppleBundleId = process.env.APPLE_BUNDLE_ID?.trim() ?? "";
let expectedAppleAppId = null;
if (enableIosAssociation) {
  const appleTeamId = required("APPLE_TEAM_ID");
  const appleBundleId = required("APPLE_BUNDLE_ID");
  if (!/^[A-Z0-9]{10}$/.test(appleTeamId)) {
    fail("APPLE_TEAM_ID phải gồm đúng 10 ký tự chữ hoa/số từ Apple Developer.");
  }
  if (
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
      appleBundleId
    )
  ) {
    fail("APPLE_BUNDLE_ID phải là bundle ID reverse-DNS hợp lệ.");
  }
  expectedAppleAppId = `${appleTeamId}.${appleBundleId}`;
} else if (rawAppleTeamId || rawAppleBundleId) {
  fail(
    "Khi ENABLE_IOS_ASSOCIATION=false, APPLE_TEAM_ID và APPLE_BUNDLE_ID phải để trống."
  );
}

const policyPaths = ["/privacy", "/account-deletion", "/terms", "/acceptable-use", "/support"];
await Promise.all(policyPaths.map((path) => checkHtml(portalOrigin, `${portalBasePath}${path}`)));

const assetLinks = await checkJson(appLinkOrigin, "/.well-known/assetlinks.json");
if (!Array.isArray(assetLinks)) {
  fail("assetlinks.json phải là một JSON array.");
}
const androidTarget = assetLinks.find(
  (statement) => statement?.target?.package_name === "com.vpsttt.webtui_chat"
)?.target;
if (!androidTarget) {
  fail("assetlinks.json thiếu package com.vpsttt.webtui_chat.");
}
const actualFingerprints = androidTarget.sha256_cert_fingerprints ?? [];
for (const fingerprint of expectedFingerprint) {
  if (!actualFingerprints.includes(fingerprint)) {
    fail(`assetlinks.json thiếu Play App Signing fingerprint ${fingerprint}.`);
  }
}

if (enableIosAssociation) {
  const appleAssociation = await checkJson(
    appLinkOrigin,
    "/.well-known/apple-app-site-association"
  );
  const details = appleAssociation?.applinks?.details;
  const expectedPaths = ["/conversations", "/conversations/*", "/notifications"];
  if (!Array.isArray(details) || details.length !== 1) {
    fail("apple-app-site-association phải có đúng một applinks.details entry.");
  }
  const [detail] = details;
  if (
    !Array.isArray(detail.appIDs) ||
    detail.appIDs.length !== 1 ||
    detail.appIDs[0] !== expectedAppleAppId ||
    detail.appID
  ) {
    fail(
      `apple-app-site-association phải chỉ chứa App ID ${expectedAppleAppId}.`
    );
  }
  const actualPaths = Array.isArray(detail.components)
    ? detail.components.map((component) => component?.["/"])
    : [];
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    fail(
      `apple-app-site-association phải chứa đúng các path: ${expectedPaths.join(", ")}.`
    );
  }
} else {
  const aasaResponse = await fetchDirect(
    appLinkOrigin,
    "/.well-known/apple-app-site-association"
  );
  if (aasaResponse.status !== 404 && aasaResponse.status !== 410) {
    fail(
      `apple-app-site-association phải trả 404/410 khi ENABLE_IOS_ASSOCIATION=false, hiện trả HTTP ${aasaResponse.status}.`
    );
  }
}

console.log(
  `Production portal hợp lệ: ${policyPaths.length} public support/policy pages, Android assetlinks và iOS association ${enableIosAssociation ? "đã bật" : "đã tắt (404/410)"}.`
);

async function checkHtml(origin, path) {
  const response = await directFetch(origin, path);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    fail(`${new URL(path, origin)} trả Content-Type ${contentType || "trống"}, cần text/html.`);
  }
  const body = await response.text();
  if (body.length < 500 || /CHANGE_ME|\bTODO\b|\bTBD\b/i.test(body)) {
    fail(`${new URL(path, origin)} thiếu nội dung policy hoàn chỉnh hoặc còn placeholder.`);
  }
}

async function checkJson(origin, path) {
  const response = await directFetch(origin, path);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    fail(`${new URL(path, origin)} trả Content-Type ${contentType || "trống"}, cần application/json.`);
  }
  try {
    return await response.json();
  } catch {
    fail(`${new URL(path, origin)} không trả JSON hợp lệ.`);
  }
}

async function directFetch(origin, path) {
  const response = await fetchDirect(origin, path);
  const url = new URL(path, `${origin}/`);
  if (response.status !== 200) {
    fail(`${url} trả HTTP ${response.status}; endpoint production phải trả trực tiếp 200.`);
  }
  return response;
}

async function fetchDirect(origin, path) {
  const url = new URL(path, `${origin}/`);
  let response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "WebTUI-Store-Production-Check/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(15_000)
    });
  } catch (error) {
    fail(`${url} không truy cập được qua TLS: ${error instanceof Error ? error.message : error}`);
  }
  return response;
}

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) fail(`Thiếu biến ${name}. Hãy nạp deploy/.env production trước.`);
  return value;
}

function optionalBoolean(name, defaultValue) {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return defaultValue;
  if (raw !== "true" && raw !== "false") {
    fail(`${name} phải là true hoặc false.`);
  }
  return raw === "true";
}

function requiredHttpsOrigin(name) {
  const value = required(name);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(`${name} không phải URL hợp lệ.`);
  }
  if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    fail(`${name} phải là HTTPS origin không có path/query/fragment.`);
  }
  return parsed.origin;
}

function fail(message) {
  console.error(`Production check thất bại: ${message}`);
  process.exit(1);
}
