import {
  Download,
  ExternalLink,
  FileText,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone
} from "@/components/icons";
import { DomainOnboarding } from "@/components/domain-onboarding";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { readPublicComplianceConfig } from "@/lib/public-config";

export default function PortalHomePage() {
  const config = readPublicComplianceConfig();
  return (
    <main>
      <SiteHeader config={config} />

      <DomainOnboarding />

      <section className="architecture" aria-labelledby="architecture-title">
        <div>
          <p className="eyebrow"><ShieldCheck size={16} /> Kiến trúc sở hữu dữ liệu</p>
          <h2 id="architecture-title">Một domain, một instance độc lập</h2>
        </div>
        <div className="flow-list">
          <article>
            <span>01</span>
            <Server size={22} />
            <div><strong>Cài trên VPS</strong><p>Web, API, PostgreSQL, storage, WebSocket và TURN.</p></div>
          </article>
          <article>
            <span>02</span>
            <FileText size={22} />
            <div><strong>Portal discovery</strong><p>Kiểm tra domain, TLS, phiên bản và trạng thái instance.</p></div>
          </article>
          <article>
            <span>03</span>
            <Monitor size={22} />
            <div><strong>Dùng client chung</strong><p>Web, desktop và mobile kết nối trực tiếp tới server công ty.</p></div>
          </article>
        </div>
      </section>

      <section className="downloads" id="downloads" aria-labelledby="downloads-title">
        <div className="downloads__heading">
          <p className="eyebrow"><Download size={16} /> Download center</p>
          <h2 id="downloads-title">Ứng dụng dùng chung cho mọi instance</h2>
          <p>Không cần build app riêng. Mở app, nhập domain công ty và đăng nhập.</p>
        </div>
        <div className="download-links">
          <a href={config.desktopDownloadUrl}>
            <Monitor size={24} />
            <span><strong>Desktop app</strong><small>Windows, macOS và Linux</small></span>
            <Download size={18} />
          </a>
          <a href={config.mobileDownloadUrl}>
            <Smartphone size={24} />
            <span><strong>Mobile app</strong><small>Android và iOS</small></span>
            <Download size={18} />
          </a>
          <a href={config.documentationUrl}>
            <FileText size={24} />
            <span><strong>Tài liệu self-host</strong><small>Cài đặt, backup và cập nhật</small></span>
            <ExternalLink size={18} />
          </a>
        </div>
      </section>

      <SiteFooter config={config} />
    </main>
  );
}
