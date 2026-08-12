import { ArrowRight, Mail } from "@/components/icons";
import type { PublicComplianceConfig } from "@/lib/public-config";
import { portalPath } from "@/lib/public-config";

export function SiteHeader({
  config,
  label = "Self-hosted portal",
}: {
  config: PublicComplianceConfig;
  label?: string;
}) {
  return (
    <header className="site-header">
      <a
        aria-label="VPS TTT Chat Portal"
        className="brand"
        href={config.portalBasePath || "/"}
      >
        <img
          alt=""
          height="42"
          src={portalPath(config, "/brand/logo_webtui.png")}
          width="42"
        />
        <span>
          <strong>VPS TTT Chat Portal</strong>
          <small>{label}</small>
        </span>
      </a>

      <nav aria-label="Điều hướng chính">
        <a href={portalPath(config, "/#features")}>Tính năng</a>
        <a href={portalPath(config, "/privacy")}>Bảo mật</a>
        <a href={portalPath(config, "/#downloads")}>Tải ứng dụng</a>
        <a href={portalPath(config, "/terms")}>Điều khoản</a>
        <a href={portalPath(config, "/support")}>Hỗ trợ</a>
      </nav>

      <div className="site-header__actions">
        <span className="system-pill">
          <i />
          Hệ thống đang hoạt động
        </span>
        <a className="header-action" href={portalPath(config, "/#downloads")}>
          Tải app
        </a>
      </div>
    </header>
  );
}

export function SiteFooter({ config }: { config: PublicComplianceConfig }) {
  return (
    <footer className="site-footer-main">
      <div className="site-footer-main__brand">
        <img
          alt=""
          height="38"
          src={portalPath(config, "/brand/logo_webtui.png")}
          width="38"
        />
        <div>
          <strong>VPS TTT Chat Portal</strong>
          <span>Giao tiếp riêng tư trên hạ tầng của bạn.</span>
        </div>
      </div>

      <div className="site-footer-main__links">
        <nav aria-label="Liên kết sản phẩm">
          <strong>Sản phẩm</strong>
          <a href={portalPath(config, "/#downloads")}>Tải ứng dụng</a>
          <a href={config.documentationUrl}>Tài liệu self-host</a>
          <a href={portalPath(config, "/account-deletion")}>Xóa tài khoản</a>
        </nav>
        <nav aria-label="Liên kết pháp lý">
          <strong>Chính sách</strong>
          <a href={portalPath(config, "/privacy")}>Quyền riêng tư</a>
          <a href={portalPath(config, "/terms")}>Điều khoản</a>
          <a href={portalPath(config, "/acceptable-use")}>Sử dụng hợp lệ</a>
        </nav>
        <nav aria-label="Liên kết hỗ trợ">
          <strong>Liên hệ</strong>
          <a href={portalPath(config, "/support")}>
            Trung tâm hỗ trợ <ArrowRight size={14} />
          </a>
          <a href={`mailto:${config.supportEmail}`}>
            <Mail size={14} />
            {config.supportEmail}
          </a>
        </nav>
      </div>

      <div className="site-footer-main__legal">
        <span>
          {config.legalEntityName} · {config.legalCountry}
        </span>
        <span>© 2026 WebTUI Chat</span>
      </div>
    </footer>
  );
}

export function PolicyIdentity({ config }: { config: PublicComplianceConfig }) {
  return (
    <dl className="policy-identity">
      <div>
        <dt>Nhà phát hành</dt>
        <dd>{config.legalEntityName}</dd>
      </div>
      <div>
        <dt>Địa chỉ</dt>
        <dd>
          {config.legalAddress}, {config.legalCountry}
        </dd>
      </div>
      <div>
        <dt>Phiên bản chính sách</dt>
        <dd>{config.policyVersion}</dd>
      </div>
      <div>
        <dt>Ngày hiệu lực</dt>
        <dd>{config.policyEffectiveDate}</dd>
      </div>
    </dl>
  );
}
