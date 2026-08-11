import type { Metadata } from "next";
import {
  PolicyIdentity,
  SiteFooter,
  SiteHeader,
} from "@/components/site-shell";
import {
  portalPath,
  portalUrl,
  readPublicComplianceConfig,
} from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/privacy") },
    description:
      "Chính sách quyền riêng tư chính thức cho ứng dụng WebTUI Chat trên Android, iOS, web và desktop.",
    openGraph: {
      description:
        "Dữ liệu WebTUI Chat xử lý, trách nhiệm của operator self-hosted và quyền của người dùng.",
      title: "Chính sách quyền riêng tư WebTUI Chat",
      url: portalUrl(config, "/privacy"),
    },
    robots: { follow: true, index: true },
    title: "Chính sách quyền riêng tư",
  };
}

export default function PrivacyPage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page">
      <SiteHeader config={config} label="Quyền riêng tư" />
      <article className="policy-document">
        <header>
          <p className="eyebrow">Chính sách công khai</p>
          <h1>Chính sách quyền riêng tư</h1>
          <p className="policy-lead">
            Chính sách này áp dụng cho ứng dụng WebTUI Chat chính thức trên
            Android, iOS, web, desktop và portal do {config.legalEntityName}{" "}
            phát hành. Mỗi tổ chức self-hosted vẫn chịu trách nhiệm riêng đối
            với dữ liệu trong instance mà họ vận hành.
          </p>
          <PolicyIdentity config={config} />
        </header>

        <section>
          <h2>1. Ai chịu trách nhiệm với dữ liệu?</h2>
          <p>
            <strong>Operator của instance</strong> (tổ chức sở hữu domain bạn
            nhập) quyết định tài khoản nào được tạo, mục đích sử dụng, người
            được truy cập, vị trí lưu trữ và vòng đời nội dung chat. Operator là
            đầu mối đầu tiên cho yêu cầu truy cập, sửa, xuất hoặc xóa dữ liệu
            trên instance đó.
          </p>
          <p>
            <strong>{config.legalEntityName}</strong> chịu trách nhiệm đối với
            portal, bản app chính thức, dịch vụ phân phối bản cập nhật và các
            relay do mình trực tiếp vận hành. Portal discovery không nhận mật
            khẩu, access token, refresh token hoặc nội dung chat. Liên hệ
            privacy:{" "}
            <a href={`mailto:${config.privacyEmail}`}>{config.privacyEmail}</a>.
          </p>
        </section>

        <section>
          <h2>2. Dữ liệu được xử lý</h2>
          <ul>
            <li>
              Tài khoản/hồ sơ: email, tên đăng nhập, tên hiển thị, avatar, số
              điện thoại tùy chọn, vai trò và membership.
            </li>
            <li>
              Nội dung do người dùng tạo (UGC): tin nhắn, phản ứng, file, ảnh,
              video, bản ghi âm, nhiệm vụ và lịch họp.
            </li>
            <li>
              Dữ liệu thiết bị/phiên: định danh do app tạo, phiên đăng nhập,
              phiên bản app, nền tảng, ngôn ngữ, múi giờ, địa chỉ IP và
              User-Agent do instance ghi nhận.
            </li>
            <li>
              Bằng chứng chấp thuận: phiên bản Điều khoản/Chính sách quyền riêng
              tư, thời điểm chấp thuận và dữ liệu kỹ thuật tối thiểu nêu trên;
              áp dụng cả khi khách tham gia phòng công khai mà không tạo tài
              khoản.
            </li>
            <li>
              Thông báo: token FCM/APNs, tùy chọn push và phần payload cần
              thiết; preview chỉ được gửi khi cấu hình cho phép.
            </li>
            <li>
              Cuộc gọi: metadata signaling; âm thanh/video truyền qua WebRTC
              trực tiếp hoặc TURN do operator cấu hình.
            </li>
            <li>
              An toàn: báo cáo nội dung/người dùng, lý do, bằng chứng cần thiết,
              trạng thái xử lý và audit log moderation.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Mục đích xử lý</h2>
          <p>
            Dữ liệu được dùng để xác thực, đồng bộ hội thoại, gửi thông báo,
            thực hiện cuộc gọi, bảo vệ tài khoản, ngăn lạm dụng, xử lý báo cáo,
            khắc phục lỗi và cung cấp chức năng quản trị theo yêu cầu của người
            dùng hoặc operator. Bản app chính thức không tích hợp mạng quảng
            cáo, không bán dữ liệu cá nhân và không dùng nội dung chat để theo
            dõi người dùng giữa các ứng dụng.
          </p>
        </section>

        <section>
          <h2>4. Bên nhận và nhà cung cấp dịch vụ</h2>
          <p>
            Dữ liệu instance có thể được xử lý bởi quản trị viên và nhà cung cấp
            hạ tầng mà operator lựa chọn. Khi bật push, token và payload cần
            thiết đi tới Firebase Cloud Messaging hoặc Apple Push Notification
            service, trực tiếp hoặc qua relay được instance công bố. Nhà phát
            hành không cấp khóa FCM/APNs của app chính thức cho operator và
            không cho phép operator dùng chúng ngoài chức năng thông báo của
            WebTUI Chat.
          </p>
        </section>

        <section>
          <h2>5. Báo cáo UGC và chặn người dùng</h2>
          <p>
            Từ menu của tin nhắn hoặc hồ sơ, người dùng có thể chọn{" "}
            <strong>Báo cáo</strong>, nêu lý do và gửi bằng chứng cần thiết tới
            moderation queue của operator. Người dùng cũng có thể{" "}
            <strong>Chặn</strong>
            hoặc bỏ chặn tài khoản; thao tác chặn ngăn tương tác trực tiếp theo
            phạm vi hiển thị trong app.
          </p>
          <p>
            Operator xem xét báo cáo, bảo toàn audit trail và có thể ẩn nội
            dung, giới hạn hoặc đình chỉ tài khoản. Mục tiêu phản hồi ban đầu là
            trong {config.ugcReportResponseHours} giờ. Trường hợp đe dọa khẩn
            cấp, bóc lột trẻ em hoặc vấn đề an toàn ở cấp ứng dụng có thể gửi
            tới{" "}
            <a href={`mailto:${config.safetyEmail}`}>{config.safetyEmail}</a>.
            Không gửi thêm dữ liệu nhạy cảm ngoài phần cần để xác minh.
          </p>
        </section>

        <section>
          <h2>6. Lưu trữ và xóa</h2>
          <ul>
            <li>
              Dữ liệu tài khoản active được hoàn tất xóa trong tối đa{" "}
              {config.accountDeletionDays} ngày sau xác minh hợp lệ.
            </li>
            <li>
              Tin nhắn/nội dung thuộc workspace có thể được giữ như hồ sơ cộng
              tác sau khi đã tách khỏi hồ sơ, thông tin xác thực và định danh
              active; operator công bố thời hạn theo mục đích và nghĩa vụ của tổ
              chức.
            </li>
            <li>
              Security/audit log có quyền truy cập giới hạn và được giữ theo
              lịch operator công bố, trong thời gian cần cho an toàn, chống gian
              lận hoặc nghĩa vụ pháp lý.
            </li>
            <li>
              Chi tiết do người báo cáo cung cấp và snapshot bằng chứng
              moderation được xóa nội dung nhạy cảm sau tối đa{" "}
              {config.moderationEvidenceRetentionDays} ngày; trạng thái, lý do
              chuẩn hóa và mốc xử lý có thể tiếp tục được giữ để chứng minh
              trách nhiệm giải trình.
            </li>
            <li>
              Backup mã hóa hết vòng đời theo lịch snapshot/retention mà
              operator công bố.
            </li>
          </ul>
          <p>
            Operator phải công bố thời hạn nội dung workspace và nếu nghĩa vụ
            pháp lý buộc giữ lâu hơn. Xem quy trình đầy đủ tại{" "}
            <a href={portalPath(config, "/account-deletion")}>
              trang xóa tài khoản
            </a>
            .
          </p>
        </section>

        <section>
          <h2>7. Bảo mật</h2>
          <p>
            App yêu cầu HTTPS/WSS cho production, lưu credential dài hạn trong
            kho bảo mật của hệ điều hành, tách cache theo server/workspace và
            cho phép thu hồi phiên. Không biện pháp nào loại bỏ hoàn toàn rủi
            ro; người dùng nên báo sự cố cho operator và{" "}
            <a href={`mailto:${config.safetyEmail}`}>{config.safetyEmail}</a>.
          </p>
        </section>

        <section>
          <h2>8. Quyền và lựa chọn</h2>
          <p>
            Người dùng có thể sửa hồ sơ, tắt preview/push, thu hồi phiên, chặn
            người dùng và xóa tài khoản trong app. Yêu cầu truy cập/xuất/sửa nội
            dung trên instance được gửi cho operator. Nếu không xác định được
            operator, gửi domain instance tới {config.privacyEmail}; nhà phát
            hành sẽ hỗ trợ định tuyến nhưng không tự ý truy cập server của tổ
            chức.
          </p>
        </section>

        <section>
          <h2>9. Trẻ em</h2>
          <p>
            Dịch vụ hướng tới hoạt động cộng tác của tổ chức, không được thiết
            kế để trẻ em tự sử dụng. Operator chịu trách nhiệm đặt độ tuổi, cơ
            chế đồng ý và quyền truy cập phù hợp tại khu vực của mình. Nội dung
            bóc lột hoặc gây nguy hiểm cho trẻ em bị cấm theo{" "}
            <a href={portalPath(config, "/acceptable-use")}>
              Chính sách sử dụng hợp lệ
            </a>
            .
          </p>
        </section>

        <section>
          <h2>10. Thay đổi và liên hệ</h2>
          <p>
            Khi có thay đổi quan trọng, phiên bản/ngày hiệu lực ở đầu trang được
            cập nhật trước khi chính sách mới áp dụng. Câu hỏi kỹ thuật:{" "}
            <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>.
            Câu hỏi dữ liệu:{" "}
            <a href={`mailto:${config.privacyEmail}`}>{config.privacyEmail}</a>.
          </p>
        </section>
      </article>
      <SiteFooter config={config} />
    </main>
  );
}
