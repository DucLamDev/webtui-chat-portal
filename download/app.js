const fallbackManifest = {
  platform: "android",
  channel: "stable",
  version: "pending",
  version_code: 0,
  download_url: "",
  store_url: "",
  checksum_sha256: "",
  signer_sha256: "",
  play_app_signing_sha256: "",
  release_notes: "Kênh phân phối Android chưa được mở."
};

const manifestCandidates = [
  "./android/stable/mobile-release-manifest.json",
  "./mobile-release-manifest.json",
  "./mobile-release-manifest.example.json"
];

const text = (id, value) => {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
};

const normalizedSha256 = (value) =>
  String(value || "")
    .replace(/[^0-9a-f]/gi, "")
    .toUpperCase();

const safeHttpsUrl = (value, allowedHosts) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && allowedHosts.includes(parsed.hostname)
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
};

async function fetchManifest() {
  for (const url of manifestCandidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Static preview can run without a local server; fall back below.
    }
  }
  return fallbackManifest;
}

function renderManifest(manifest) {
  const version = manifest.version || manifest.current_version || "unknown";
  const versionCode = manifest.version_code || "-";
  const channel = manifest.channel || "stable";
  const checksum = normalizedSha256(manifest.checksum_sha256);
  const releaseNotes = manifest.release_notes || "Chưa có ghi chú phát hành.";

  text("versionLabel", version);
  text("versionCodeLabel", String(versionCode));
  text("channelLabel", channel);
  text("checksumValue", checksum || "Chưa có artifact public đã xác minh");
  text("releaseNotes", releaseNotes);

  const storeLink = document.getElementById("storeLink");
  const storeUrl = safeHttpsUrl(manifest.store_url, [
    "play.google.com",
    "market.android.com"
  ]);
  if (storeLink && storeUrl) {
    storeLink.href = storeUrl;
    storeLink.hidden = false;
  }

  const signer = normalizedSha256(manifest.signer_sha256);
  const playSigner = normalizedSha256(manifest.play_app_signing_sha256);
  const downloadUrl = safeHttpsUrl(manifest.download_url, [
    globalThis.location.hostname
  ]);
  const directDownloadVerified =
    downloadUrl &&
    checksum.length === 64 &&
    signer.length === 64 &&
    signer === playSigner;
  const apkLink = document.getElementById("apkLink");
  if (apkLink && directDownloadVerified) {
    apkLink.href = downloadUrl;
    apkLink.hidden = false;
  }

  text(
    "distributionStatus",
    storeUrl || directDownloadVerified
      ? "Chỉ dùng kênh phát hành đã xác minh bên dưới."
      : "Bản Android production chưa được mở để tải."
  );
}

fetchManifest().then(renderManifest);
