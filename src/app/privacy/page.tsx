import type { Metadata } from "next";
import {
  CalendarDays,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  Server,
  ShieldCheck,
  UserRound,
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

      <section className="legal-hero legal-hero--privacy">
        <div className="legal-hero__copy">
          <p className="hero-badge">
            <ShieldCheck size={16} />
            Chính sách quyền riêng tư
          </p>
          <h1>Chính sách quyền riêng tư</h1>
          <p>
            VPS TTT Chat Portal cam kết bảo vệ quyền riêng tư và dữ liệu của
            bạn. Chúng tôi minh bạch về cách thu thập, sử dụng và bảo vệ dữ
            liệu trong mô hình self-hosted.
          </p>
          <div className="legal-hero__meta">
            <a href={`mailto:${config.privacyEmail}`}>
              <Mail size={18} />
              {config.privacyEmail}
            </a>
            <span>
              <CalendarDays size={18} />
              Cập nhật: {config.policyEffectiveDate}
            </span>
          </div>
        </div>

        <div className="privacy-art" aria-hidden="true">
          <div className="privacy-art__bubble privacy-art__bubble--chat" />
          <div className="privacy-art__card privacy-art__card--one" />
          <div className="privacy-art__card privacy-art__card--two" />
          <div className="privacy-art__shield">
            <LockKeyhole size={50} />
          </div>
          <div className="privacy-art__server">
            <i />
            <i />
            <i />
          </div>
          <span className="privacy-art__route privacy-art__route--one" />
          <span className="privacy-art__route privacy-art__route--two" />
        </div>
      </section>

      <section className="policy-highlights" aria-label="Tóm tắt quyền riêng tư">
        <article>
          <ShieldCheck size={30} />
          <span>
            <strong>Không lưu credential</strong>
            <small>Mật khẩu và token không được lưu trên portal.</small>
          </span>
        </article>
        <article>
          <Database size={30} />
          <span>
            <strong>Dữ liệu ở hạ tầng của bạn</strong>
            <small>Tin nhắn và file nằm trong server của tổ chức.</small>
          </span>
        </article>
        <article>
          <UserRound size={30} />
          <span>
            <strong>Quyền kiểm soát thuộc về bạn</strong>
            <small>Bạn có quyền quản lý, xuất và yêu cầu xóa dữ liệu.</small>
          </span>
        </article>
      </section>

      <article className="policy-document policy-document--with-nav">
        <aside className="policy-toc" aria-label="Nội dung chính">
          <strong>Nội dung chính</strong>
          <a href="#privacy-overview">
            <ShieldCheck size={16} />
            Tổng quan
          </a>
          <a href="#privacy-data">
            <FileText size={16} />
            Dữ liệu xử lý
          </a>
          <a href="#privacy-security">
            <LockKeyhole size={16} />
            Bảo vệ dữ liệu
          </a>
          <a href="#privacy-sharing">
            <Server size={16} />
            Chia sẻ dữ liệu
          </a>
          <a href="#privacy-rights">
            <UserRound size={16} />
            Quyền của bạn
          </a>
          <a href="#privacy-contact">
            <Mail size={16} />
            Liên hệ
          </a>
          <p>
            Chúng tôi chỉ xử lý dữ liệu ở mức tối thiểu để cung cấp dịch vụ và
            bảo mật hệ thống.
          </p>
        </aside>

        <div className="policy-content">
          <PolicyIdentity config={config} />

          <section className="policy-block" id="privacy-overview">
            <span className="policy-block__icon">
              <ShieldCheck size={28} />
            </span>
            <div>
              <h2>1. Ai chịu trách nhiệm với dữ liệu?</h2>
              <p>
                <strong>Operator của instance</strong> là tổ chức sở hữu domain
                bạn nhập. Operator quyết định tài khoản nào được tạo, mục đích
                sử dụng, người được truy cập, vị trí lưu trữ và vòng đời nội
                dung chat.
              </p>
              <p>
                <strong>{config.legalEntityName}</strong> chịu trách nhiệm đối
                với portal, bản app chính thức, dịch vụ phân phối bản cập nhật
                và các relay do mình trực tiếp vận hành. Portal discovery không
                nhận mật khẩu, access token, refresh token hoặc nội dung chat.
              </p>
            </div>
          </section>

          <section className="policy-block" id="privacy-data">
            <span className="policy-block__icon policy-block__icon--blue">
              <FileText size={28} />
            </span>
            <div>
              <h2>2. Dữ liệu chúng tôi xử lý</h2>
              <ul>
                <li>
                  Thông tin tài khoản: email, tên đăng nhập, tên hiển thị,
                  avatar, vai trò và membership.
                </li>
                <li>
                  Nội dung do người dùng tạo: tin nhắn, phản ứng, file, ảnh,
                  video, bản ghi âm, nhiệm vụ và lịch họp.
                </li>
                <li>
                  Thông tin kỹ thuật: phiên bản app, nền tảng, ngôn ngữ, múi
                  giờ, địa chỉ IP, User-Agent và dữ liệu phiên do instance ghi
                  nhận.
                </li>
                <li>
                  Thông báo, cuộc gọi và an toàn: token push, metadata
                  signaling, báo cáo nội dung và audit log moderation.
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-block" id="privacy-security">
            <span className="policy-block__icon policy-block__icon--green">
              <LockKeyhole size={28} />
            </span>
            <div>
              <h2>3. Cách chúng tôi bảo vệ dữ liệu</h2>
              <ul className="check-list">
                <li>Yêu cầu HTTPS/WSS cho môi trường production.</li>
                <li>
                  Lưu credential dài hạn trong kho bảo mật của hệ điều hành.
                </li>
                <li>
                  Tách cache theo server/workspace và cho phép thu hồi phiên.
                </li>
                <li>
                  Không tích hợp mạng quảng cáo, không bán dữ liệu cá nhân và
                  không dùng nội dung chat để theo dõi người dùng giữa các ứng
                  dụng.
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-block" id="privacy-sharing">
            <span className="policy-block__icon">
              <Server size={28} />
            </span>
            <div>
              <h2>4. Bên nhận và nhà cung cấp dịch vụ</h2>
              <p>
                Dữ liệu instance có thể được xử lý bởi quản trị viên và nhà
                cung cấp hạ tầng mà operator lựa chọn. Khi bật push, token và
                payload cần thiết có thể đi tới Firebase Cloud Messaging hoặc
                Apple Push Notification service.
              </p>
              <p>
                Nhà phát hành không cấp khóa FCM/APNs của app chính thức cho
                operator và không cho phép operator dùng chúng ngoài chức năng
                thông báo của WebTUI Chat.
              </p>
            </div>
          </section>

          <section className="policy-block" id="privacy-rights">
            <span className="policy-block__icon policy-block__icon--blue">
              <UserRound size={28} />
            </span>
            <div>
              <h2>5. Quyền của bạn, lưu trữ và xóa</h2>
              <p>
                Người dùng có thể sửa hồ sơ, tắt preview/push, thu hồi phiên,
                chặn người dùng và xóa tài khoản trong app. Yêu cầu truy cập,
                xuất, sửa hoặc xóa nội dung trên instance được gửi cho
                operator.
              </p>
              <p>
                Dữ liệu tài khoản active được hoàn tất xóa trong tối đa{" "}
                {config.accountDeletionDays} ngày sau xác minh hợp lệ. Chi tiết
                quy trình nằm tại{" "}
                <a href={portalPath(config, "/account-deletion")}>
                  trang xóa tài khoản
                </a>
                .
              </p>
            </div>
          </section>

          <section className="policy-block" id="privacy-contact">
            <span className="policy-block__icon policy-block__icon--coral">
              <Mail size={28} />
            </span>
            <div>
              <h2>6. Báo cáo an toàn, trẻ em, thay đổi và liên hệ</h2>
              <p>
                Từ menu của tin nhắn hoặc hồ sơ, người dùng có thể chọn{" "}
                <strong>Báo cáo</strong> hoặc <strong>Chặn</strong>. Operator
                xem xét báo cáo và phản hồi ban đầu trong mục tiêu{" "}
                {config.ugcReportResponseHours} giờ.
              </p>
              <p>
                Dịch vụ hướng tới hoạt động cộng tác của tổ chức, không được
                thiết kế để trẻ em tự sử dụng. Nội dung gây nguy hiểm cho trẻ em
                bị cấm theo{" "}
                <a href={portalPath(config, "/acceptable-use")}>
                  Chính sách sử dụng hợp lệ
                </a>
                .
              </p>
              <p>
                Câu hỏi kỹ thuật, quyền riêng tư hoặc an toàn vui lòng gửi tới{" "}
                <a href={`mailto:${config.supportEmail}`}>
                  {config.supportEmail}
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </article>

      <SiteFooter config={config} />
    </main>
  );
}
