import type { PublicComplianceConfig } from "./public-config";

export function buildAndroidAssetLinks(config: PublicComplianceConfig) {
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: config.androidPackageName,
        sha256_cert_fingerprints: config.playSigningFingerprints
      }
    }
  ];
}

export function buildAppleAppSiteAssociation(config: PublicComplianceConfig) {
  if (!config.enableIosAssociation || !config.appleAppId) {
    throw new Error(
      "Không thể tạo AASA khi ENABLE_IOS_ASSOCIATION chưa bật hoặc Apple identity chưa hợp lệ."
    );
  }
  return {
    applinks: {
      details: [
        {
          appIDs: [config.appleAppId],
          components: [
            { "/": "/conversations", comment: "Mở danh sách hội thoại trong WebTUI Chat" },
            { "/": "/conversations/*", comment: "Mở hội thoại trong WebTUI Chat" },
            { "/": "/notifications", comment: "Mở danh sách thông báo trong WebTUI Chat" }
          ]
        }
      ]
    }
  };
}
