import type { Metadata } from "next";
import { AccountDeletionLauncher } from "@/components/account-deletion-launcher";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Database,
  ExternalLink,
  LockKeyhole,
  Mail,
  Server,
  ShieldCheck,
  UserRound,
} from "@/components/icons";
import { PolicyIdentity, SiteFooter, SiteHeader } from "@/components/site-shell";
import { portalUrl, readPublicComplianceConfig } from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/account-deletion") },
    description:
      "Xóa tài khoản WebTUI Chat và dữ liệu liên kết, kể cả khi không còn cài ứng dụng.",
    openGraph: {
      description:
        "Quy trình chính thức để yêu cầu xóa tài khoản và dữ liệu WebTUI Chat.",
      title: "Xóa tài khoản WebTUI Chat",
      url: portalUrl(config, "/account-deletion"),
    },
    robots: { follow: true, index: true },
    title: "Xóa tài khoản",
  };
}

export default function AccountDeletionPage() {
  const config = readPublicComplianceConfig();
  const deletionMail = new URL(`mailto:${config.privacyEmail}`);
  deletionMail.searchParams.set(
    "subject",
    "Yêu cầu xóa tài khoản WebTUI Chat",
  );
  deletionMail.searchParams.set(
    "body",
    "Domain instance:\nEmail/tên đăng nhập:\n\nTôi yêu cầu xóa tài khoản và dữ liệu liên kết.",
  );

  return (
    <main className="policy-page account-delete-page">
      <SiteHeader config={config} label="Xóa tài khoản" />

      <section className="legal-hero legal-hero--deletion">
        <div className="legal-hero__copy">
          <p className="hero-badge">
            <ShieldCheck size={16} />
            Quyền kiểm soát dữ liệu
          </p>
          <h1>Yêu cầu xóa tài khoản WebTUI Chat</h1>
          <p>
            Tài khoản nằm trên instance self-hosted của tổ chức bạn. Bạn có thể
            xóa ngay trong app hoặc gửi yêu cầu mà không cần cài lại app. Không
            bao giờ gửi mật khẩu, OTP, access token hay refresh token cho bộ
            phận hỗ trợ.
          </p>
          <div className="legal-hero__meta">
            <a href={`mailto:${config.privacyEmail}`}>
              <Mail size={18} />
              {config.privacyEmail}
            </a>
            <span>
              <CalendarDays size={18} />
              Hoàn tất tối đa {config.accountDeletionDays} ngày
            </span>
          </div>
        </div>

        <div className="deletion-art" aria-hidden="true">
          <div className="deletion-art__profile">
            <UserRound size={48} />
          </div>
          <div className="deletion-art__panel">
            <span />
            <span />
            <span />
          </div>
          <div className="deletion-art__lock">
            <LockKeyhole size={30} />
          </div>
          <div className="deletion-art__server">
            <Server size={22} />
            <i />
            <i />
          </div>
          <span className="deletion-art__route deletion-art__route--one" />
          <span className="deletion-art__route deletion-art__route--two" />
        </div>
      </section>

      <section className="policy-highlights" aria-label="Tóm tắt xóa tài khoản">
        <article>
          <UserRound size={30} />
          <span>
            <strong>Mở đúng instance</strong>
            <small>Nhập domain tổ chức để tới server đang giữ tài khoản.</small>
          </span>
        </article>
        <article>
          <Database size={30} />
          <span>
            <strong>Xóa dữ liệu active</strong>
            <small>Hồ sơ, phiên, thiết bị và token được thu hồi.</small>
          </span>
        </article>
        <article>
          <LockKeyhole size={30} />
          <span>
            <strong>Không gửi credential</strong>
            <small>Yêu cầu chỉ cần domain và email/tên đăng nhập.</small>
          </span>
        </article>
      </section>

      <article className="deletion-page deletion-page--redesigned">
        <section className="deletion-launch-panel">
          <div>
            <p className="eyebrow">
              <ArrowRight size={16} /> Mở đúng instance
            </p>
            <h2>Bắt đầu yêu cầu xóa tài khoản</h2>
            <p>
              Portal kiểm tra domain rồi mở mục xóa tài khoản trên server của
              tổ chức. Nếu không thể đăng nhập, dùng email mẫu ở cuối trang.
            </p>
          </div>
          <AccountDeletionLauncher />
        </section>

        <section className="deletion-steps" aria-labelledby="deletion-steps-title">
          <h2 id="deletion-steps-title">Cách xóa trong ứng dụng</h2>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Mở đúng instance</strong>
                <p>Nhập domain tổ chức và đăng nhập tài khoản cần xóa.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Mở Quyền riêng tư</strong>
                <p>
                  Chọn Cài đặt → Quyền riêng tư & phiên đăng nhập → Xóa tài
                  khoản.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Chuyển quyền và xác nhận</strong>
                <p>
                  Nếu là owner duy nhất, chọn một thành viên active để nhận
                  quyền; đọc phạm vi, nhập DELETE rồi xác nhận.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="deletion-data" aria-labelledby="deletion-data-title">
          <h2 id="deletion-data-title">Dữ liệu bị xóa hoặc thu hồi</h2>
          <ul>
            <li>
              <CheckCircle2 size={18} /> Hồ sơ, thông tin xác thực và tùy chọn
              cá nhân.
            </li>
            <li>
              <CheckCircle2 size={18} /> Phiên đăng nhập, thiết bị và token
              FCM/APNs.
            </li>
            <li>
              <CheckCircle2 size={18} /> Membership, presence và con trỏ đồng
              bộ.
            </li>
            <li>
              <CheckCircle2 size={18} /> Credential và cache cục bộ trên thiết
              bị sau khi server xác nhận.
            </li>
          </ul>
          <p>
            Instance hoàn tất xóa dữ liệu tài khoản đang hoạt động trong tối đa{" "}
            {config.accountDeletionDays} ngày sau khi xác minh hợp lệ. Quyền
            truy cập và phiên đăng nhập được thu hồi khi yêu cầu xóa thành công.
          </p>
        </section>

        <section className="deletion-data" aria-labelledby="retained-data-title">
          <h2 id="retained-data-title">Dữ liệu có thể được giữ lại</h2>
          <ul>
            <li>
              Tin nhắn và nội dung thuộc workspace có thể tiếp tục nằm trong hồ
              sơ cộng tác của tổ chức sau khi được tách khỏi hồ sơ, thông tin xác
              thực và định danh active của tài khoản.
            </li>
            <li>
              Security/audit log được giới hạn truy cập và giữ theo lịch mà
              operator công bố, chỉ trong thời gian cần cho an toàn, chống gian
              lận hoặc nghĩa vụ pháp lý.
            </li>
            <li>
              Bản backup mã hóa hết vòng đời theo lịch snapshot mà operator công
              bố và không được dùng để phục hồi riêng tài khoản đã xóa vào hệ
              thống đang hoạt động.
            </li>
          </ul>
          <p>
            Operator có thể phải giữ dữ liệu lâu hơn khi pháp luật buộc họ thực
            hiện. Khi đó operator phải nêu căn cứ, phạm vi và thời hạn trong
            phản hồi cho người yêu cầu.
          </p>
        </section>

        <aside className="deletion-support" aria-labelledby="deletion-support-title">
          <div>
            <h2 id="deletion-support-title">Không thể đăng nhập?</h2>
            <p>
              Gửi yêu cầu từ email gắn với tài khoản, kèm domain instance và
              email/tên đăng nhập. Operator của instance là bên trực tiếp xác
              minh và xóa dữ liệu; {config.legalEntityName} sẽ định tuyến yêu
              cầu tới operator khi có đủ thông tin liên hệ.
            </p>
          </div>
          <a href={deletionMail.toString()}>
            Tạo email yêu cầu <ExternalLink size={16} />
          </a>
        </aside>

        <section className="support-identity account-identity">
          <PolicyIdentity config={config} />
        </section>
      </article>

      <SiteFooter config={config} />
    </main>
  );
}
