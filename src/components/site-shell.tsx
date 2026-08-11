import type { PublicComplianceConfig } from "@/lib/public-config";
import { portalPath } from "@/lib/public-config";

export function SiteHeader({
  config,
  label = "Self-hosted portal"
}: {
  config: PublicComplianceConfig;
  label?: string;
}) {
  return (
    <header className="site-header">
      <a className="brand" href={config.portalBasePath || "/"} aria-label="WebTUI Chat Portal">
        <img
          alt=""
          height="42"
          src={portalPath(config, "/brand/logo_webtui.png")}
          width="42"
        />
        <span><strong>WebTUI Chat</strong><small>{label}</small></span>
      </a>
      <nav aria-label="Điều hướng chính">
        <a href={portalPath(config, "/privacy")}>Quyền riêng tư</a>
        <a href={portalPath(config, "/terms")}>Điều khoản</a>
        <a href={portalPath(config, "/support")}>Hỗ trợ</a>
      </nav>
    </header>
  );
}

export function SiteFooter({ config }: { config: PublicComplianceConfig }) {
  return (
    <footer className="site-footer-main">
      <div>
        <strong>WebTUI Chat</strong>
        <span>{config.legalEntityName} · {config.legalCountry}</span>
      </div>
      <nav aria-label="Liên kết pháp lý">
        <a href={portalPath(config, "/privacy")}>Quyền riêng tư</a>
        <a href={portalPath(config, "/account-deletion")}>Xóa tài khoản</a>
        <a href={portalPath(config, "/terms")}>Điều khoản</a>
        <a href={portalPath(config, "/acceptable-use")}>Sử dụng hợp lệ</a>
        <a href={portalPath(config, "/support")}>Hỗ trợ</a>
      </nav>
      <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>
    </footer>
  );
}

export function PolicyIdentity({ config }: { config: PublicComplianceConfig }) {
  return (
    <dl className="policy-identity">
      <div><dt>Nhà phát hành</dt><dd>{config.legalEntityName}</dd></div>
      <div><dt>Địa chỉ</dt><dd>{config.legalAddress}, {config.legalCountry}</dd></div>
      <div><dt>Phiên bản chính sách</dt><dd>{config.policyVersion}</dd></div>
      <div><dt>Ngày hiệu lực</dt><dd>{config.policyEffectiveDate}</dd></div>
    </dl>
  );
}
