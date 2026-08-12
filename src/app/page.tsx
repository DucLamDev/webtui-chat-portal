import {
  Activity,
  AndroidLogo,
  AppleLogo,
  ArrowRight,
  CheckCircle2,
  Database,
  Download,
  ExternalLink,
  FileText,
  LockKeyhole,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
  WindowsLogo,
} from "@/components/icons";
import { DomainOnboarding } from "@/components/domain-onboarding";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { portalPath, readPublicComplianceConfig } from "@/lib/public-config";

export default function PortalHomePage() {
  const config = readPublicComplianceConfig();
  return (
    <main>
      <SiteHeader config={config} />

      <DomainOnboarding assetBasePath={config.portalBasePath} />

      <section className="trust-band" id="features" aria-label="Cam kết của portal">
        <div>
          <span className="trust-band__icon trust-band__icon--blue">
            <ShieldCheck size={34} />
          </span>
          <span>
            <strong>Không lưu credential</strong>
            <small>Mật khẩu và token không đi qua portal.</small>
          </span>
        </div>
        <div>
          <span className="trust-band__icon trust-band__icon--green">
            <Database size={34} />
          </span>
          <span>
            <strong>Dữ liệu do bạn sở hữu</strong>
            <small>Chat và file ở lại server công ty.</small>
          </span>
        </div>
        <div>
          <span className="trust-band__icon trust-band__icon--coral">
            <Monitor size={34} />
          </span>
          <span>
            <strong>Một client, mọi instance</strong>
            <small>Kết nối từ desktop và mobile.</small>
          </span>
        </div>
      </section>

      <section className="architecture" aria-labelledby="architecture-title">
        <div className="architecture__visual">
          <div className="architecture__scan" aria-hidden="true" />
          <img
            alt="Giao diện WebTUI Chat trên màn hình lớn"
            src={portalPath(config, "/showcase/tablet-chat.png")}
          />
          <div className="architecture__badge">
            <LockKeyhole size={18} />
            <span>
              <strong>Kết nối riêng tư</strong>
              <small>Không trung chuyển nội dung</small>
            </span>
          </div>
        </div>
        <div className="architecture__content">
          <p className="eyebrow">
            <ShieldCheck size={16} /> Kiến trúc sở hữu dữ liệu
          </p>
          <h2 id="architecture-title">
            Một domain, một không gian làm việc độc lập
          </h2>
          <p className="section-lead">
            Portal chỉ làm nhiệm vụ discovery. Sau khi xác minh, ứng dụng kết
            nối thẳng tới hạ tầng của tổ chức.
          </p>
          <div className="flow-list">
            <article>
              <span>01</span>
              <Server size={22} />
              <div>
                <strong>Triển khai trên VPS</strong>
                <p>Web, API, PostgreSQL, storage, WebSocket và TURN.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <FileText size={22} />
              <div>
                <strong>Xác minh instance</strong>
                <p>Kiểm tra domain, TLS, phiên bản và trạng thái sẵn sàng.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <Activity size={22} />
              <div>
                <strong>Kết nối trực tiếp</strong>
                <p>Desktop và mobile làm việc với server công ty.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="downloads" id="downloads" aria-labelledby="downloads-title">
        <div className="downloads__heading">
          <p className="eyebrow">
            <Download size={16} /> Download Center
          </p>
          <h2 id="downloads-title">
            Tải ứng dụng phù hợp với thiết bị của bạn
          </h2>
          <p>
            Chọn nền tảng, cài ứng dụng rồi nhập domain công ty để bắt đầu kết
            nối và làm việc.
          </p>
          <a className="text-link" href={config.documentationUrl}>
            Xem tài liệu triển khai <ExternalLink size={16} />
          </a>
        </div>

        <div className="platform-grid">
          <a
            className="platform-card platform-card--windows"
            href={config.desktopDownloadUrl}
          >
            <span className="platform-card__icon">
              <WindowsLogo size={34} />
            </span>
            <span>
              <small>Desktop</small>
              <strong>Windows</strong>
              <em>Windows 10 trở lên</em>
            </span>
            <ArrowRight size={19} />
          </a>
          <a
            className="platform-card platform-card--mac"
            href={config.desktopDownloadUrl}
          >
            <span className="platform-card__icon">
              <AppleLogo size={34} />
            </span>
            <span>
              <small>Desktop</small>
              <strong>macOS</strong>
              <em>Apple Silicon và Intel</em>
            </span>
            <ArrowRight size={19} />
          </a>
          <a
            className="platform-card platform-card--android"
            href={config.mobileDownloadUrl}
          >
            <span className="platform-card__icon">
              <AndroidLogo size={34} />
            </span>
            <span>
              <small>Mobile</small>
              <strong>Android</strong>
              <em>Google Play và APK</em>
            </span>
            <ArrowRight size={19} />
          </a>
          <a
            className="platform-card platform-card--ios"
            href={config.mobileDownloadUrl}
          >
            <span className="platform-card__icon">
              <Smartphone size={34} />
            </span>
            <span>
              <small>Mobile</small>
              <strong>iOS</strong>
              <em>iPhone và iPad</em>
            </span>
            <ArrowRight size={19} />
          </a>
        </div>

        <div className="downloads__footnote">
          <CheckCircle2 size={17} />
          Bộ cài hiện tại chỉ phát hành cho 4 nền tảng được hỗ trợ.
        </div>
      </section>

      <SiteFooter config={config} />
    </main>
  );
}
