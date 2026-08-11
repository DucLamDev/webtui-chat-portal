import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const sourceDir = join(projectRoot, "store-assets", "source");
const outputDir = join(projectRoot, "store-assets", "play");
const logoPath = join(projectRoot, "public", "brand", "logo_webtui.png");
const phoneChatSourcePath = join(sourceDir, "phone-chat.png");
const phoneConversationsSourcePath = join(sourceDir, "phone-conversations.png");
const retiredTabletOutputPath = join(
  outputDir,
  "tablet",
  "01-chat-1024x768.png",
);

await ensureScreenshotSources();

const logo = await readFile(logoPath);
const phoneChat = await readFile(phoneChatSourcePath);
const phoneConversations = await readFile(phoneConversationsSourcePath);

const featureBackground = Buffer.from(`
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eaf6ff"/>
        <stop offset="0.52" stop-color="#bfe2ff"/>
        <stop offset="1" stop-color="#5bb6ff"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1495ff" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#0057d9" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="500" fill="url(#background)"/>
    <circle cx="90" cy="82" r="165" fill="#ffffff" fill-opacity="0.32"/>
    <circle cx="934" cy="444" r="245" fill="url(#accent)"/>
    <rect x="337" y="48" width="350" height="350" rx="92" fill="#ffffff" fill-opacity="0.56"/>
    <path d="M403 428C455 409 573 409 625 428" fill="none" stroke="#006ee6" stroke-opacity="0.16" stroke-width="22" stroke-linecap="round"/>
  </svg>
`);

const iconBuffer = await sharp(logo)
  .resize(512, 512, { fit: "contain", kernel: sharp.kernel.lanczos3 })
  // The source uses transparent cut-outs for the W/chat dots. Flattening on
  // white preserves the intended brand contrast across Play surfaces. Play's
  // store icon contract is still a 32-bit PNG, so retain an explicit (opaque)
  // alpha channel after flattening.
  .flatten({ background: "#ffffff" })
  .ensureAlpha(1)
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

const featureLogo = await sharp(logo)
  .resize(292, 292, { fit: "contain", kernel: sharp.kernel.lanczos3 })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
const featureBuffer = await sharp(featureBackground)
  .composite([{ input: featureLogo, left: 366, top: 77 }])
  .removeAlpha()
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

const phoneChatBuffer = await playPhoneScreenshot(phoneChat);
const phoneConversationsBuffer = await playPhoneScreenshot(phoneConversations);

async function playPhoneScreenshot(input) {
  return sharp(input)
    .extend({
      background: "#f4f7fb",
      bottom: 10,
      left: 21,
      right: 21,
      top: 10,
    })
    .removeAlpha()
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

const assets = [
  {
    alpha: true,
    buffer: iconBuffer,
    path: join(outputDir, "icon-512.png"),
    size: [512, 512],
  },
  {
    alpha: false,
    buffer: featureBuffer,
    path: join(outputDir, "feature-graphic-1024x500.png"),
    size: [1024, 500],
  },
  {
    alpha: false,
    buffer: phoneChatBuffer,
    path: join(outputDir, "phone", "01-chat-432x864.png"),
    size: [432, 864],
  },
  {
    alpha: false,
    buffer: phoneConversationsBuffer,
    path: join(outputDir, "phone", "02-conversations-432x864.png"),
    size: [432, 864],
  },
];

for (const asset of assets) {
  const metadata = await sharp(asset.buffer).metadata();
  if (
    metadata.format !== "png" ||
    metadata.width !== asset.size[0] ||
    metadata.height !== asset.size[1] ||
    metadata.hasAlpha !== asset.alpha
  ) {
    throw new Error(
      `${relativePath(asset.path)} phải là PNG ${asset.size[0]}x${asset.size[1]} alpha=${asset.alpha}; nhận ${metadata.format} ${metadata.width}x${metadata.height}, alpha=${metadata.hasAlpha}.`,
    );
  }
}

const manifest = {
  generator: "scripts/generate-store-assets.mjs",
  inputs: {
    logo: relativeAssetPath(logoPath, logo),
    phoneChatScreenshot: relativeAssetPath(phoneChatSourcePath, phoneChat),
    phoneConversationsScreenshot: relativeAssetPath(
      phoneConversationsSourcePath,
      phoneConversations,
    ),
  },
  outputs: Object.fromEntries(
    assets.map(({ alpha, buffer, path, size }) => [
      relativePath(path),
      {
        alpha,
        bytes: buffer.byteLength,
        height: size[1],
        sha256: sha256(buffer),
        width: size[0],
      },
    ]),
  ),
};
const manifestBuffer = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
assets.push({
  buffer: manifestBuffer,
  path: join(outputDir, "manifest.json"),
  size: [0, 0],
});

if (checkOnly) {
  const mismatches = [];
  if (existsSync(retiredTabletOutputPath)) {
    mismatches.push(
      `${relativePath(retiredTabletOutputPath)} is a retired 1024x768 large-screen asset and must not be uploaded to Play`,
    );
  }
  for (const asset of assets) {
    if (!existsSync(asset.path)) {
      mismatches.push(`${relativePath(asset.path)} chưa tồn tại`);
      continue;
    }
    const existing = await readFile(asset.path);
    if (!existing.equals(asset.buffer)) {
      mismatches.push(
        `${relativePath(asset.path)} không khớp output deterministic`,
      );
    }
  }
  if (mismatches.length) {
    throw new Error(
      `${mismatches.join("\n")}\nChạy npm run assets:store rồi commit output.`,
    );
  }
  console.log(`Store assets hợp lệ (${assets.length - 1} ảnh + manifest).`);
} else {
  await rm(retiredTabletOutputPath, { force: true });
  for (const asset of assets) {
    await mkdir(dirname(asset.path), { recursive: true });
    await writeFile(asset.path, asset.buffer);
  }
  console.log(
    `Đã tạo ${assets.length - 1} store assets tại ${relativePath(outputDir)}.`,
  );
}

async function ensureScreenshotSources() {
  const siblingScreenshots = resolve(
    projectRoot,
    "..",
    "webtui-chat-mobile",
    "test",
    "screenshots",
  );
  await ensureScreenshotSource({
    configuredSource: process.env.STORE_PHONE_CHAT_SCREENSHOT_SOURCE,
    fallbackSource: join(
      projectRoot,
      "download",
      "assets",
      "android-chat-preview.png",
    ),
    height: 844,
    target: phoneChatSourcePath,
    width: 390,
  });
  await ensureScreenshotSource({
    configuredSource: process.env.STORE_PHONE_CONVERSATIONS_SCREENSHOT_SOURCE,
    fallbackSource: join(siblingScreenshots, "phase_m4_phone.png"),
    height: 844,
    target: phoneConversationsSourcePath,
    width: 390,
  });
}

async function ensureScreenshotSource({
  configuredSource,
  fallbackSource,
  height,
  target,
  width,
}) {
  if (existsSync(target)) return;
  if (checkOnly) {
    throw new Error(`Thiếu ${relativePath(target)}.`);
  }
  const source = configuredSource?.trim()
    ? resolve(configuredSource.trim())
    : fallbackSource;
  if (!existsSync(source)) {
    throw new Error(
      `Thiếu screenshot thật cho ${relativePath(target)}. Cung cấp biến source tương ứng hoặc đặt repo mobile cạnh portal.`,
    );
  }
  const metadata = await sharp(source).metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(
      `${source} phải là ${width}x${height}; generator không kéo giãn/cắt screenshot store.`,
    );
  }
  await mkdir(sourceDir, { recursive: true });
  await sharp(source)
    .png({ compressionLevel: 9, palette: false })
    .toFile(target);
}

function relativeAssetPath(path, buffer) {
  return { path: relativePath(path), sha256: sha256(buffer) };
}

function relativePath(path) {
  return path.slice(projectRoot.length + 1).replaceAll("\\", "/");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}
