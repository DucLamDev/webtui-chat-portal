import { expect, test } from "@playwright/test";

const customerOrigin = "https://chat.company.example";
const iosAssociationEnabled =
  process.env.ENABLE_IOS_ASSOCIATION?.trim().toLowerCase() === "true";

test.beforeEach(async ({ page }) => {
  await page.route(`${customerOrigin}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/v1/discovery") {
      await route.fulfill({
        body: JSON.stringify({
          data: {
            discovery: {
              version: "1",
              instance_id: "11111111-1111-4111-8111-111111111111",
              capabilities: {
                account_deletion: true,
                blocking: true,
                legal_acceptance: true,
                moderation: true,
                reporting: true,
                self_hosted: true,
              },
              deployment: { status: "ready" },
              domain: "chat.company.example",
              runtime: {
                api_contract_version: 1,
                api_base_url: customerOrigin,
                app_name: "Company Chat",
                app_version: "1.0.0",
                minimum_supported_mobile_version: "1.0.0",
                server_version: "1.0.0",
                web_base_url: customerOrigin,
                ws_base_url: "wss://chat.company.example/ws",
              },
              zone: {
                id: "11111111-1111-4111-8111-111111111111",
                name: "Company Chat",
                registration_mode: "open",
                status: "active",
              },
            },
          },
        }),
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        status: 200,
      });
      return;
    }

    await route.fulfill({
      body: "<title>Company Chat</title>",
      contentType: "text/html",
      status: 200,
    });
  });
});

test("discovery hợp lệ chuyển browser tới đăng ký trên instance customer", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Domain WebTUI Chat").fill("chat.company.example");
  await page.getByRole("button", { name: "Kiểm tra" }).click();

  await expect(page).toHaveURL(
    `${customerOrigin}/?auth=register&source=portal`,
  );
});

test("portal không tràn ngang trên mobile", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBe(metrics.innerWidth);
});

test("Download Center chỉ hiển thị các nền tảng được hỗ trợ", async ({
  page,
}) => {
  await page.goto("/");
  const downloads = page.locator("#downloads");

  await expect(downloads.getByText("Windows", { exact: true })).toBeVisible();
  await expect(downloads.getByText("macOS", { exact: true })).toBeVisible();
  await expect(downloads.getByText("Android", { exact: true })).toBeVisible();
  await expect(downloads.getByText("iOS", { exact: true })).toBeVisible();
  await expect(downloads.getByText("Linux", { exact: true })).toHaveCount(0);
});

for (const policy of [
  { heading: "Chính sách quyền riêng tư", path: "/privacy" },
  { heading: "Yêu cầu xóa tài khoản WebTUI Chat", path: "/account-deletion" },
  { heading: "Điều khoản sử dụng", path: "/terms" },
  { heading: "Chính sách sử dụng hợp lệ", path: "/acceptable-use" },
  { heading: "Hỗ trợ WebTUI Chat", path: "/support" },
]) {
  test(`${policy.path} công khai nội dung store canonical`, async ({
    page,
  }) => {
    await page.goto(policy.path);

    await expect(
      page.getByRole("heading", { level: 1, name: policy.heading }),
    ).toBeVisible();
    const canonicalHref = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonicalHref).not.toBeNull();
    const canonical = new URL(canonicalHref ?? "");
    expect(canonical.protocol).toBe("https:");
    expect(canonical.pathname).toBe(policy.path);
  });
}

for (const path of [
  "/privacy",
  "/account-deletion",
  "/terms",
  "/acceptable-use",
  "/support",
]) {
  test(`${path} không tràn ngang trên mobile`, async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto(path);

    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(metrics.scrollWidth).toBe(metrics.innerWidth);
  });
}

test("công bố Android Digital Asset Links bằng Play signing certificate", async ({
  request,
}) => {
  const response = await request.get("/.well-known/assetlinks.json", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  const body = await response.json();
  expect(body).toHaveLength(1);
  expect(body[0].relation).toEqual([
    "delegate_permission/common.handle_all_urls",
  ]);
  expect(body[0].target.namespace).toBe("android_app");
  expect(body[0].target.package_name).toBe("com.vpsttt.webtui_chat");
  expect(body[0].target.sha256_cert_fingerprints).toHaveLength(1);
  expect(body[0].target.sha256_cert_fingerprints[0]).toMatch(
    /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/,
  );
});

test("chỉ công bố Apple Universal Links khi được bật rõ ràng", async ({
  request,
}) => {
  const response = await request.get(
    "/.well-known/apple-app-site-association",
    {
      maxRedirects: 0,
    },
  );

  if (!iosAssociationEnabled) {
    expect(response.status()).toBe(404);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect((await response.body()).length).toBe(0);
    return;
  }

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect((await response.json()).applinks.details[0].appIDs).toEqual([
    "ABCDE12345.com.vpsttt.webtuiChat",
  ]);
});
