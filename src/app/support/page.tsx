import type { Metadata } from "next";
import {
  Activity,
  AndroidLogo,
  AppleLogo,
  ArrowRight,
  CheckCircle2,
  Download,
  Globe2,
  Headphones,
  Mail,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  WindowsLogo,
} from "@/components/icons";
import { PolicyIdentity, SiteFooter, SiteHeader } from "@/components/site-shell";
import {
  portalPath,
  portalUrl,
  readPublicComplianceConfig,
} from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/support") },
    description:
      "Kênh hỗ trợ kỹ thuật, quyền riêng tư, xóa tài khoản và báo cáo an toàn của WebTUI Chat.",
    openGraph: {
      description:
        "Liên hệ đúng đầu mối hỗ trợ WebTUI Chat và operator self-hosted.",
      title: "Hỗ trợ WebTUI Chat",
      url: portalUrl(config, "/support"),
    },
    robots: { follow: true, index: true },
    title: "Hỗ trợ",
  };
}

export default function SupportPage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page support-page">
      <SiteHeader config={config} label="Hỗ trợ" />

      <section className="legal-hero legal-hero--support">
        <div className="legal-hero__copy">
          <p className="hero-badge">
            <Headphones size={16} />
            Trung tâm hỗ trợ
          </p>
          <h1>Hỗ trợ WebTUI Chat</h1>
          <p>
            Tìm câu trả lời nhanh, kiểm tra tình trạng hệ thống hoặc liên hệ đội
            ngũ hỗ trợ. Khi gửi yêu cầu, hãy kèm domain instance, phiên bản app
            và mô tả ngắn.
          </p>
          <div className="legal-hero__meta">
            <a href={`mailto:${config.supportEmail}`}>
              <Mail size={18} />
              {config.supportEmail}
            </a>
            <span>
              <CheckCircle2 size={18} />
              Phản hồi ban đầu trong {config.supportResponseHours} giờ
            </span>
          </div>
        </div>

        <div className="support-art" aria-hidden="true">
          <div className="support-art__headset">
            <Headphones size={76} />
          </div>
          <div className="support-art__laptop">
            <span />
            <span />
            <span />
          </div>
          <div className="support-art__phone" />
          <div className="support-art__server">
            <i />
            <i />
            <i />
          </div>
          <div className="support-art__chart">
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className="support-art__pulse" />
        </div>
      </section>

      <section className="support-workbench" aria-label="Công cụ hỗ trợ">
        <div className="support-faq-panel">
          <label className="support-search" htmlFor="support-search">
            <Search size={22} />
            <input
              id="support-search"
              placeholder="Tìm câu hỏi hoặc nhập domain"
              type="search"
            />
          </label>

          <div className="faq-card">
            <h2>Câu hỏi thường gặp</h2>
            <details open>
              <summary>VPS TTT Chat Portal là gì?</summary>
              <p>
                Đây là portal để tải app chính thức và xác minh domain instance
                self-hosted trước khi mở đúng không gian làm việc của tổ chức.
              </p>
            </details>
            <details>
              <summary>Làm thế nào để kết nối với chat công ty?</summary>
              <p>
                Tải ứng dụng, nhập domain công ty và để portal kiểm tra
                discovery endpoint. Sau khi hợp lệ, app sẽ kết nối trực tiếp tới
                server của tổ chức.
              </p>
            </details>
            <details>
              <summary>Tôi có thể dùng trên những thiết bị nào?</summary>
              <p>
                Download Center hiện hỗ trợ Windows, macOS, Android và iOS.
              </p>
            </details>
            <details>
              <summary>Dữ liệu của tôi có được bảo mật không?</summary>
              <p>
                Portal không nhận mật khẩu hoặc token. Dữ liệu chat và file nằm
                trên hạ tầng do operator của tổ chức vận hành.
              </p>
            </details>
            <details>
              <summary>Tôi quên mật khẩu, phải làm sao?</summary>
              <p>
                Liên hệ quản trị viên của instance trước. Nếu không xác định
                được operator, gửi domain instance tới {config.supportEmail}.
              </p>
            </details>
          </div>
        </div>

        <div className="support-action-panel">
          <div className="support-card-grid">
            <article className="support-card support-card--mail">
              <span>
                <Mail size={30} />
              </span>
              <h2>Email hỗ trợ</h2>
              <p>Gửi yêu cầu và nhận hỗ trợ trong thời gian sớm nhất.</p>
              <a href={`mailto:${config.supportEmail}`}>
                <Mail size={16} />
                {config.supportEmail}
              </a>
            </article>

            <article className="support-card support-card--domain">
              <span>
                <Globe2 size={32} />
              </span>
              <h2>Kiểm tra domain</h2>
              <p>Kiểm tra kết nối và xác thực domain của bạn.</p>
              <a href={portalPath(config, "/")}>
                Mở kiểm tra <ArrowRight size={16} />
              </a>
            </article>

            <article className="support-card support-card--status">
              <span>
                <Activity size={32} />
              </span>
              <h2>Trạng thái hệ thống</h2>
              <p>Theo dõi tình trạng hoạt động của toàn bộ hệ thống.</p>
              <strong>
                <i />
                Tất cả hệ thống đang hoạt động
              </strong>
            </article>
          </div>

          <div className="diagnostic-card">
            <div>
              <h2>Chẩn đoán nhanh kết nối</h2>
              <p>Kiểm tra các điểm kết nối quan trọng đến hệ thống.</p>
            </div>
            <div className="diagnostic-path" aria-label="Luồng kiểm tra kết nối">
              <span>
                <CheckCircle2 size={18} />
                Thiết bị của bạn
                <small>Hoạt động tốt</small>
              </span>
              <span>
                <CheckCircle2 size={18} />
                Kết nối Internet
                <small>Hoạt động tốt</small>
              </span>
              <span>
                <ShieldCheck size={18} />
                Mạng/VPN
                <small>Hoạt động tốt</small>
              </span>
              <span>
                <Server size={18} />
                Máy chủ VPS TTT
                <small>Hoạt động tốt</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="support-downloads" aria-labelledby="support-downloads-title">
        <div>
          <p className="eyebrow">
            <Download size={16} /> Download Center
          </p>
          <h2 id="support-downloads-title">Tải đúng ứng dụng cho thiết bị</h2>
          <p>Tải ứng dụng phù hợp với thiết bị để bắt đầu kết nối và làm việc.</p>
        </div>
        <div className="download-chip-grid">
          <a className="download-chip download-chip--windows" href={config.desktopDownloadUrl}>
            <WindowsLogo size={30} />
            <span>
              <strong>Windows</strong>
              <small>Windows 10 trở lên</small>
            </span>
            <ArrowRight size={17} />
          </a>
          <a className="download-chip download-chip--mac" href={config.desktopDownloadUrl}>
            <AppleLogo size={30} />
            <span>
              <strong>macOS</strong>
              <small>Apple Silicon & Intel</small>
            </span>
            <ArrowRight size={17} />
          </a>
          <a className="download-chip download-chip--android" href={config.mobileDownloadUrl}>
            <AndroidLogo size={30} />
            <span>
              <strong>Android</strong>
              <small>Google Play & APK</small>
            </span>
            <ArrowRight size={17} />
          </a>
          <a className="download-chip download-chip--ios" href={config.mobileDownloadUrl}>
            <Smartphone size={30} />
            <span>
              <strong>iOS</strong>
              <small>iPhone và iPad</small>
            </span>
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section className="support-identity">
        <PolicyIdentity config={config} />
      </section>

      <SiteFooter config={config} />
    </main>
  );
}
