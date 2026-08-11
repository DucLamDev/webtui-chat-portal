import type { Metadata } from "next";
import { PolicyIdentity, SiteFooter, SiteHeader } from "@/components/site-shell";
import { portalPath, portalUrl, readPublicComplianceConfig } from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/terms") },
    description: "Điều khoản sử dụng ứng dụng và portal WebTUI Chat.",
    openGraph: {
      description: "Điều kiện sử dụng ứng dụng WebTUI Chat chính thức và trách nhiệm của operator self-hosted.",
      title: "Điều khoản sử dụng WebTUI Chat",
      url: portalUrl(config, "/terms")
    },
    robots: { follow: true, index: true },
    title: "Điều khoản sử dụng"
  };
}

export default function TermsPage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page">
      <SiteHeader config={config} label="Điều khoản sử dụng" />
      <article className="policy-document">
        <header>
          <p className="eyebrow">Điều khoản công khai</p>
          <h1>Điều khoản sử dụng</h1>
          <p className="policy-lead">
            Các điều khoản này điều chỉnh việc sử dụng bản app, portal và dịch vụ phân phối WebTUI Chat chính thức
            của {config.legalEntityName}. Tổ chức vận hành instance có thể áp dụng điều khoản bổ sung, nhưng không
            được làm giảm quyền bắt buộc của người dùng theo pháp luật hiện hành.
          </p>
          <PolicyIdentity config={config} />
        </header>

        <section>
          <h2>1. Chấp nhận và điều kiện sử dụng</h2>
          <p>
            Khi tạo tài khoản hoặc tiếp tục sử dụng ứng dụng, bạn đồng ý với Điều khoản này, Chính sách quyền riêng tư
            và Chính sách sử dụng hợp lệ. Nếu sử dụng thay mặt tổ chức, bạn xác nhận mình có quyền ràng buộc tổ chức đó.
            Người chưa đủ tuổi ký kết tại nơi cư trú chỉ được dùng khi có sự cho phép và giám sát hợp lệ.
          </p>
        </section>

        <section>
          <h2>2. Mô hình self-hosted</h2>
          <p>
            App kết nối trực tiếp tới domain do bạn hoặc tổ chức lựa chọn. Operator của domain quản lý tài khoản,
            nội dung, thành viên, moderation, retention, backup và hạ tầng instance. {config.legalEntityName} cung cấp
            client/portal chính thức nhưng không mặc nhiên sở hữu, truy cập hoặc quản trị dữ liệu trên server đó.
          </p>
        </section>

        <section>
          <h2>3. Tài khoản và bảo mật</h2>
          <p>
            Bạn phải cung cấp thông tin chính xác, giữ an toàn credential, không dùng chung phiên trái phép và báo ngay
            khi nghi ngờ bị chiếm quyền. Operator có thể yêu cầu xác minh, thu hồi phiên hoặc giới hạn tài khoản để bảo
            vệ instance. Bộ phận hỗ trợ không bao giờ yêu cầu mật khẩu, OTP hoặc token đăng nhập.
          </p>
        </section>

        <section>
          <h2>4. Giấy phép ứng dụng</h2>
          <p>
            Trong thời gian tuân thủ Điều khoản, bạn được cấp quyền có giới hạn, không độc quyền, không chuyển nhượng để
            cài và sử dụng app cho mục đích giao tiếp/cộng tác hợp pháp. Quyền đối với tên, logo, bản app chính thức và
            tài liệu thuộc nhà phát hành hoặc bên cấp phép tương ứng. Giấy phép mã nguồn, nếu có, tiếp tục áp dụng riêng
            cho phần code được công bố theo giấy phép đó.
          </p>
        </section>

        <section>
          <h2>5. Nội dung của người dùng</h2>
          <p>
            Bạn giữ quyền đối với nội dung mình tạo và cam kết có quyền chia sẻ nội dung đó. Bạn cấp cho operator quyền
            kỹ thuật cần thiết để lưu, truyền, hiển thị, sao lưu và xử lý nội dung nhằm vận hành instance. Không có điều
            khoản nào cấp cho nhà phát hành quyền dùng nội dung chat để quảng cáo hoặc huấn luyện mô hình ngoài mục đích
            bạn/operator yêu cầu rõ ràng.
          </p>
        </section>

        <section>
          <h2>6. An toàn, báo cáo và chặn</h2>
          <p>
            Nội dung/hành vi phải tuân thủ <a href={portalPath(config, "/acceptable-use")}>Chính sách sử dụng hợp lệ</a>.
            Bạn có thể báo cáo tin nhắn hoặc người dùng và chặn tương tác từ menu tương ứng. Operator có thể điều tra,
            ẩn nội dung, giới hạn tính năng, đình chỉ hoặc xóa tài khoản. Báo cáo cấp ứng dụng/an toàn khẩn cấp gửi tới
            {" "}<a href={`mailto:${config.safetyEmail}`}>{config.safetyEmail}</a>.
          </p>
        </section>

        <section>
          <h2>7. Dịch vụ bên thứ ba</h2>
          <p>
            Push, cuộc gọi, đăng nhập liên kết hoặc storage có thể dựa vào dịch vụ do operator lựa chọn hay FCM/APNs.
            Điều khoản của nhà cung cấp đó có thể áp dụng. Operator chịu trách nhiệm cấu hình hợp pháp, bảo mật và thông
            báo cho thành viên về các nhà cung cấp được sử dụng.
          </p>
        </section>

        <section>
          <h2>8. Thay đổi, tạm ngừng và chấm dứt</h2>
          <p>
            Chúng tôi có thể cập nhật client để sửa lỗi, bảo mật hoặc đáp ứng yêu cầu store. Operator kiểm soát tính sẵn
            sàng của instance. Bạn có thể ngừng sử dụng và xóa tài khoản bất cứ lúc nào. Khi vi phạm nghiêm trọng, quyền
            dùng bản app/dịch vụ liên quan có thể bị giới hạn sau khi cân nhắc mức độ, an toàn và khả năng khắc phục.
          </p>
        </section>

        <section>
          <h2>9. Cam kết và giới hạn hợp lý</h2>
          <p>
            Dịch vụ được cung cấp theo khả năng hiện có; không thể bảo đảm mọi instance hoặc mạng bên thứ ba luôn không
            gián đoạn. Không nội dung nào trong Điều khoản loại trừ trách nhiệm không được phép loại trừ hoặc quyền người
            tiêu dùng bắt buộc. Trong phạm vi pháp luật cho phép, mỗi bên chịu trách nhiệm về thiệt hại trực tiếp có thể
            dự đoán hợp lý do vi phạm nghĩa vụ của mình và thực hiện biện pháp hợp lý để giảm thiệt hại.
          </p>
        </section>

        <section>
          <h2>10. Luật áp dụng và liên hệ</h2>
          <p>
            Điều khoản được giải thích theo pháp luật áp dụng đối với {config.legalEntityName} tại {config.legalCountry},
            đồng thời tôn trọng quyền bắt buộc tại nơi người dùng cư trú. Trước khi khởi kiện, các bên nên gửi thông báo
            tới <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a> để có cơ hội giải quyết thiện chí.
          </p>
        </section>
      </article>
      <SiteFooter config={config} />
    </main>
  );
}
