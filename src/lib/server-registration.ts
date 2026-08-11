export type PortalServer = {
  apiBaseUrl: string;
  appVersion: string;
  domain: string;
  entryUrl: string;
  instanceId: string;
  name: string;
  registrationMode: string;
  webBaseUrl: string;
  wsBaseUrl: string;
};

export function buildAccountDeletionEntry(entryUrl: string): string {
  const entry = new URL(entryUrl);
  entry.searchParams.set("auth", "login");
  entry.searchParams.set("section", "settings");
  entry.searchParams.set("account_action", "delete");
  entry.searchParams.set("source", "account-deletion");
  entry.hash = "delete-account-title";
  return entry.toString();
}

type ZoneDiscovery = Record<string, unknown>;

export function normalizePortalServer(rawServer: string): {
  domain: string;
  origin: string;
} {
  const origin = serverDiscoveryBaseUrl(rawServer, "http://localhost:8080");
  return {
    domain: new URL(origin).hostname.toLowerCase(),
    origin,
  };
}

export function parsePortalDiscovery(
  payload: unknown,
  expectedOrigin: string,
): PortalServer {
  const expected = new URL(expectedOrigin);
  const discovery = unwrapDiscovery(payload);
  const version = textValue(discovery.version);
  const instanceId = lowerText(discovery.instance_id);
  const domain = lowerText(discovery.domain);
  const zone = objectValue(discovery.zone);
  const runtime = objectValue(discovery.runtime);
  const capabilities = objectValue(discovery.capabilities);
  const deployment = objectValue(discovery.deployment);

  if (version !== "1") {
    throw new Error("Instance dùng discovery contract không được hỗ trợ.");
  }
  const zoneId = lowerText(zone.id);
  if (!UUID_PATTERN.test(instanceId) || instanceId !== zoneId) {
    throw new Error("Instance không cung cấp định danh UUID nhất quán.");
  }

  if (domain !== expected.hostname.toLowerCase()) {
    throw new Error("Domain discovery không khớp với server đã nhập.");
  }
  if (lowerText(zone.status) !== "active") {
    throw new Error("Instance chưa ở trạng thái hoạt động.");
  }
  if (lowerText(deployment.status) !== "ready") {
    throw new Error("Instance đang cài đặt hoặc chưa sẵn sàng.");
  }
  if (capabilities.self_hosted !== true) {
    throw new Error("Domain này không phải instance WebTUI Chat self-hosted.");
  }
  for (const capability of REQUIRED_SAFETY_CAPABILITIES) {
    if (capabilities[capability] !== true) {
      throw new Error(
        `Instance thiếu capability an toàn bắt buộc: ${capability}.`,
      );
    }
  }

  if (runtime.api_contract_version !== 1) {
    throw new Error("Instance dùng API contract không được hỗ trợ.");
  }
  const serverVersion = textValue(runtime.server_version);
  const appVersion = textValue(runtime.app_version);
  const minimumMobileVersion = textValue(
    runtime.minimum_supported_mobile_version,
  );
  if (
    !serverVersion ||
    serverVersion !== appVersion ||
    !SEMVER_PATTERN.test(minimumMobileVersion)
  ) {
    throw new Error("Metadata phiên bản của instance không hợp lệ.");
  }

  const webBaseUrl = validatedRuntimeUrl(
    runtime.web_base_url,
    expected,
    ["http:", "https:"],
    "web",
  );
  const apiBaseUrl = validatedRuntimeUrl(
    runtime.api_base_url,
    expected,
    ["http:", "https:"],
    "API",
  );
  const wsBaseUrl = validatedRuntimeUrl(
    runtime.ws_base_url,
    expected,
    ["ws:", "wss:"],
    "WebSocket",
    true,
  );
  const registrationMode = lowerText(zone.registration_mode) || "closed";
  const entry = new URL(webBaseUrl);
  entry.searchParams.set(
    "auth",
    registrationMode === "open" ? "register" : "login",
  );
  entry.searchParams.set("source", "portal");

  return {
    apiBaseUrl,
    appVersion,
    domain,
    entryUrl: entry.toString(),
    instanceId,
    name: textValue(zone.name) || textValue(runtime.app_name) || domain,
    registrationMode,
    webBaseUrl,
    wsBaseUrl,
  };
}

const REQUIRED_SAFETY_CAPABILITIES = [
  "moderation",
  "reporting",
  "blocking",
  "account_deletion",
  "legal_acceptance",
] as const;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function serverDiscoveryBaseUrl(
  rawServer: string,
  defaultOrigin: string,
): string {
  const input = rawServer.trim().replace(/\/+$/, "");
  if (!input) {
    throw new Error("Hãy nhập domain WebTUI Chat của công ty.");
  }

  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(input)
    ? input
    : `https://${input}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme || defaultOrigin);
  } catch {
    throw new Error("Domain không hợp lệ.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Domain chỉ hỗ trợ HTTP hoặc HTTPS.");
  }

  parsed.pathname = "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}

function unwrapDiscovery(payload: unknown): ZoneDiscovery {
  const root = objectValue(payload);
  const data = objectValue(root.data);
  const candidate = Object.keys(data).length
    ? data.discovery
    : (root.discovery ?? root);
  const discovery = objectValue(candidate);
  if (!Object.keys(discovery).length) {
    throw new Error("Server không trả discovery WebTUI Chat hợp lệ.");
  }
  return discovery;
}

function validatedRuntimeUrl(
  value: unknown,
  expected: URL,
  schemes: string[],
  label: string,
  allowWebSocketPath = false,
): string {
  let parsed: URL;
  try {
    parsed = new URL(textValue(value));
  } catch {
    throw new Error(`Discovery thiếu ${label} URL hợp lệ.`);
  }
  const isLocal = ["localhost", "127.0.0.1"].includes(expected.hostname);
  if (
    !schemes.includes(parsed.protocol) ||
    parsed.hostname.toLowerCase() !== expected.hostname.toLowerCase() ||
    parsed.username ||
    parsed.password ||
    (!isLocal && !["https:", "wss:"].includes(parsed.protocol))
  ) {
    throw new Error(
      `${label} URL không cùng server hoặc không dùng kết nối an toàn.`,
    );
  }
  if (
    !allowWebSocketPath &&
    parsed.pathname !== "/" &&
    parsed.pathname !== ""
  ) {
    throw new Error(`${label} base URL phải là origin của instance.`);
  }
  return parsed.toString().replace(/\/$/, "");
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function lowerText(value: unknown): string {
  return textValue(value).toLowerCase();
}
