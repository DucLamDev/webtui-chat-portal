import type { Metadata } from "next";
import { PolicyIdentity, SiteFooter, SiteHeader } from "@/components/site-shell";
import { portalPath, portalUrl, readPublicComplianceConfig } from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/support") },
    description: "Kênh hỗ trợ kỹ thuật, quyền riêng tư, xóa tài khoản và báo cáo an toàn của WebTUI Chat.",
    openGraph: {
      description: "Liên hệ đúng đầu mối hỗ trợ WebTUI Chat và operator self-hosted.",
      title: "Hỗ trợ WebTUI Chat",
      url: portalUrl(config, "/support")
    },
    robots: { follow: true, index: true },
    title: "Hỗ trợ"
  };
}

export default function SupportPage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page">
      <SiteHeader config={config} label="Hỗ trợ" />
      <article className="policy-document support-document">
        <header>
          <p className="eyebrow">Store support URL</p>
          <h1>Hỗ trợ WebTUI Chat</h1>
          <p className="policy-lead">
            Chọn đúng kênh bên dưới và luôn ghi domain instance, phiên bản app, nền tảng cùng mô tả ngắn.
            Không gửi mật khẩu, OTP, access token, refresh token hoặc private key.
          </p>
          <PolicyIdentity config={config} />
        </header>

        <section>
          <h2>1. Trước tiên: xác định bên vận hành instance</h2>
          <p>
            Tổ chức sở hữu domain bạn nhập là operator trực tiếp quản lý thành viên, tin nhắn, file, moderation,
            retention và backup. Với lỗi chỉ xảy ra trên một workspace hoặc yêu cầu dữ liệu trong instance, hãy liên
            hệ quản trị viên của tổ chức trước. {config.legalEntityName} hỗ trợ app/portal chính thức và định tuyến
            yêu cầu khi có thông tin operator, nhưng không tự ý truy cập server của tổ chức.
          </p>
        </section>

        <section className="support-channels" aria-labelledby="support-channels-title">
          <h2 id="support-channels-title">2. Kênh liên hệ</h2>
          <div className="support-grid">
            <article>
              <h3>Kỹ thuật và phát hành</h3>
              <p>Crash, lỗi đăng nhập ở cấp app, lỗi portal/download hoặc câu hỏi phiên bản.</p>
              <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>
              <small>Mục tiêu phản hồi ban đầu: trong {config.supportResponseHours} giờ.</small>
            </article>
            <article>
              <h3>Quyền riêng tư và dữ liệu</h3>
              <p>Yêu cầu truy cập/sửa/xóa dữ liệu, câu hỏi privacy hoặc không xác định được operator.</p>
              <a href={`mailto:${config.privacyEmail}`}>{config.privacyEmail}</a>
              <small>Xóa account được hoàn tất trong tối đa {config.accountDeletionDays} ngày sau xác minh hợp lệ.</small>
            </article>
            <article>
              <h3>An toàn và UGC</h3>
              <p>Đe dọa, lạm dụng nghiêm trọng, bóc lột trẻ em hoặc không dùng được report trong app.</p>
              <a href={`mailto:${config.safetyEmail}`}>{config.safetyEmail}</a>
              <small>Mục tiêu phản hồi ban đầu: trong {config.ugcReportResponseHours} giờ.</small>
            </article>
          </div>
        </section>

        <section>
          <h2>3. Báo cáo nội dung/người dùng và chặn</h2>
          <p>
            Với UGC thông thường, mở menu của tin nhắn hoặc hồ sơ, chọn <strong>Báo cáo</strong>, chọn lý do rồi gửi
            tới moderation queue của operator. Chọn <strong>Chặn</strong> để ngăn tương tác trực tiếp trong lúc chờ
            xử lý. Xem phạm vi cấm và kháng nghị tại <a href={portalPath(config, "/acceptable-use")}>Chính sách sử dụng hợp lệ</a>.
          </p>
          <p>
            Nếu có nguy cơ tức thời, hãy liên hệ cơ quan khẩn cấp tại nơi xảy ra sự việc trước; email không phải kênh
            ứng cứu thời gian thực. Khi gửi safety report, chỉ cung cấp domain, ID/link nội dung và bằng chứng tối thiểu cần thiết.
          </p>
        </section>

        <section>
          <h2>4. Xóa tài khoản khi không còn app</h2>
          <p>
            Dùng <a href={portalPath(config, "/account-deletion")}>trang xóa tài khoản public</a> để mở đúng instance
            hoặc tạo email yêu cầu. Gửi từ email gắn với tài khoản, kèm domain và email/tên đăng nhập; không gửi credential.
          </p>
        </section>

        <section>
          <h2>5. Thông tin giúp xử lý nhanh</h2>
          <ul>
            <li>Domain instance và thời điểm xảy ra lỗi (kèm múi giờ).</li>
            <li>Phiên bản app/build number, Android/iOS version và model thiết bị.</li>
            <li>Các bước tái hiện, kết quả mong đợi/thực tế và screenshot đã che dữ liệu nhạy cảm.</li>
            <li>Request/report ID nếu app hoặc operator đã cấp; không gửi token hay log chứa secret.</li>
          </ul>
          <p>
            Thời hạn trên là mục tiêu phản hồi ban đầu, không phải cam kết giải quyết hoàn toàn. Vụ việc phụ thuộc
            operator, nhà cung cấp hoặc xác minh bổ sung có thể cần lâu hơn; đầu mối xử lý phải cập nhật trạng thái phù hợp.
          </p>
        </section>
      </article>
      <SiteFooter config={config} />
    </main>
  );
}
