import type { Metadata } from "next";
import { AccountDeletionLauncher } from "@/components/account-deletion-launcher";
import { CheckCircle2, ExternalLink, ShieldCheck } from "@/components/icons";

const portalBasePath = process.env.NEXT_PUBLIC_PORTAL_BASE_PATH ?? "";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@vpsttt.com";

export const metadata: Metadata = {
  title: "Xóa tài khoản | WebTUI Chat",
  description: "Hướng dẫn yêu cầu xóa tài khoản WebTUI Chat và dữ liệu cá nhân liên kết."
};

export default function AccountDeletionPage() {
  return (
    <main className="policy-page">
      <header className="site-header">
        <a className="brand" href={portalBasePath || "/"} aria-label="Về WebTUI Chat Portal">
          <img alt="" height="42" src={`${portalBasePath}/brand/logo_webtui.png`} width="42" />
          <span><strong>WebTUI Chat</strong><small>Self-hosted portal</small></span>
        </a>
        <nav aria-label="Điều hướng trang xóa tài khoản">
          <a href={portalBasePath || "/"}>Về portal</a>
        </nav>
      </header>

      <article className="deletion-page">
        <header className="deletion-page__intro">
          <p className="eyebrow"><ShieldCheck size={16} /> Quyền riêng tư tài khoản</p>
          <h1>Yêu cầu xóa tài khoản WebTUI Chat</h1>
          <p>
            Tài khoản và dữ liệu được lưu trên instance self-hosted của tổ chức bạn. Nhập domain
            bên dưới để tới đúng server và tự xóa tài khoản sau khi đăng nhập.
          </p>
        </header>

        <AccountDeletionLauncher />

        <section className="deletion-steps" aria-labelledby="deletion-steps-title">
          <h2 id="deletion-steps-title">Cách xóa tài khoản</h2>
          <ol>
            <li><span>1</span><div><strong>Mở instance</strong><p>Nhập domain công ty và đăng nhập bằng tài khoản cần xóa.</p></div></li>
            <li><span>2</span><div><strong>Mở Cài đặt</strong><p>Chọn Cài đặt → Xóa tài khoản trong ứng dụng.</p></div></li>
            <li>
              <span>3</span>
              <div>
                <strong>Chuyển quyền và xác nhận</strong>
                <p>Nếu là chủ tổ chức, nhập email một thành viên đang hoạt động để chuyển quyền; sau đó nhập DELETE.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="deletion-data" aria-labelledby="deletion-data-title">
          <h2 id="deletion-data-title">Dữ liệu nào sẽ bị xóa?</h2>
          <ul>
            <li><CheckCircle2 size={18} /> Hồ sơ tài khoản, phiên đăng nhập và push token.</li>
            <li><CheckCircle2 size={18} /> Membership, presence và tùy chọn cá nhân liên kết.</li>
            <li><CheckCircle2 size={18} /> Yêu cầu có hiệu lực ngay và không thể hoàn tác.</li>
          </ul>
          <p>
            Nội dung thuộc hồ sơ của tổ chức, như tin nhắn hoặc audit log, có thể được giữ theo
            chính sách lưu trữ của tổ chức nhưng sẽ không còn liên kết tới hồ sơ người dùng đang hoạt động.
          </p>
        </section>

        <aside className="deletion-support" aria-labelledby="deletion-support-title">
          <div>
            <h2 id="deletion-support-title">Không thể đăng nhập?</h2>
            <p>
              Hãy liên hệ quản trị viên của instance trước vì portal trung tâm không giữ và không thể
              xóa dữ liệu trên server công ty. Với lỗi kỹ thuật của portal, liên hệ {supportEmail}.
            </p>
          </div>
          <a href={`mailto:${supportEmail}?subject=WebTUI%20Chat%20account%20deletion`}>
            Liên hệ hỗ trợ <ExternalLink size={16} />
          </a>
        </aside>
      </article>
    </main>
  );
}
