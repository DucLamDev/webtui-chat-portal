import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  Server,
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
    alternates: { canonical: portalUrl(config, "/terms") },
    description: "Điều khoản sử dụng ứng dụng và portal WebTUI Chat.",
    openGraph: {
      description:
        "Điều kiện sử dụng ứng dụng WebTUI Chat chính thức và trách nhiệm của operator self-hosted.",
      title: "Điều khoản sử dụng WebTUI Chat",
      url: portalUrl(config, "/terms"),
    },
    robots: { follow: true, index: true },
    title: "Điều khoản sử dụng",
  };
}

export default function TermsPage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page terms-page">
      <SiteHeader config={config} label="Điều khoản sử dụng" />

      <section className="legal-hero legal-hero--terms">
        <div className="legal-hero__copy">
          <p className="hero-badge">
            <FileText size={16} />
            Điều khoản công khai
          </p>
          <h1>Điều khoản sử dụng</h1>
          <p>
            Các điều khoản này điều chỉnh việc sử dụng bản app, portal và dịch
            vụ phân phối WebTUI Chat chính thức của {config.legalEntityName}.
            Mô hình self-hosted giúp tổ chức kiểm soát dữ liệu, hạ tầng và
            chính sách vận hành instance của mình.
          </p>
          <div className="legal-hero__meta">
            <a href={`mailto:${config.supportEmail}`}>
              <Mail size={18} />
              {config.supportEmail}
            </a>
            <span>
              <CalendarDays size={18} />
              Hiệu lực: {config.policyEffectiveDate}
            </span>
          </div>
        </div>

        <div className="terms-art" aria-hidden="true">
          <div className="terms-art__document terms-art__document--main">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="terms-art__document terms-art__document--side">
            <span />
            <span />
            <b />
          </div>
          <div className="terms-art__seal">
            <CheckCircle2 size={44} />
          </div>
          <div className="terms-art__server">
            <Server size={22} />
            <i />
            <i />
          </div>
          <span className="terms-art__route terms-art__route--one" />
          <span className="terms-art__route terms-art__route--two" />
        </div>
      </section>

      <section className="policy-highlights" aria-label="Tóm tắt điều khoản">
        <article>
          <CheckCircle2 size={30} />
          <span>
            <strong>Quyền sử dụng rõ ràng</strong>
            <small>App chính thức được cấp quyền sử dụng hợp pháp.</small>
          </span>
        </article>
        <article>
          <Server size={30} />
          <span>
            <strong>Operator quản lý instance</strong>
            <small>Tổ chức kiểm soát tài khoản, nội dung và hạ tầng.</small>
          </span>
        </article>
        <article>
          <LockKeyhole size={30} />
          <span>
            <strong>Không yêu cầu credential</strong>
            <small>Hỗ trợ không bao giờ hỏi mật khẩu, OTP hoặc token.</small>
          </span>
        </article>
      </section>

      <article className="policy-document policy-document--with-nav">
        <aside className="policy-toc" aria-label="Nội dung điều khoản">
          <strong>Nội dung chính</strong>
          <a href="#terms-acceptance">
            <CheckCircle2 size={16} />
            Chấp nhận
          </a>
          <a href="#terms-self-hosted">
            <Server size={16} />
            Self-hosted
          </a>
          <a href="#terms-account">
            <LockKeyhole size={16} />
            Tài khoản
          </a>
          <a href="#terms-license">
            <FileText size={16} />
            Giấy phép
          </a>
          <a href="#terms-content">
            <UserRound size={16} />
            Nội dung
          </a>
          <a href="#terms-contact">
            <Mail size={16} />
            Liên hệ
          </a>
          <p>
            Điều khoản này áp dụng cho app, portal và dịch vụ phân phối chính
            thức của VPS TTT Chat Portal.
          </p>
        </aside>

        <div className="policy-content">
          <PolicyIdentity config={config} />

          <section className="policy-block" id="terms-acceptance">
            <span className="policy-block__icon">
              <CheckCircle2 size={28} />
            </span>
            <div>
              <h2>1. Chấp nhận và điều kiện sử dụng</h2>
              <p>
                Khi tạo tài khoản hoặc tiếp tục sử dụng ứng dụng, bạn đồng ý
                với Điều khoản này,{" "}
                <a href={portalPath(config, "/privacy")}>
                  Chính sách quyền riêng tư
                </a>{" "}
                và{" "}
                <a href={portalPath(config, "/acceptable-use")}>
                  Chính sách sử dụng hợp lệ
                </a>
                . Nếu sử dụng thay mặt tổ chức, bạn xác nhận mình có quyền ràng
                buộc tổ chức đó.
              </p>
              <p>
                Người chưa đủ tuổi ký kết tại nơi cư trú chỉ được dùng khi có
                sự cho phép và giám sát hợp lệ. Tổ chức vận hành instance có
                thể áp dụng điều khoản bổ sung, nhưng không được làm giảm quyền
                bắt buộc của người dùng theo pháp luật hiện hành.
              </p>
            </div>
          </section>

          <section className="policy-block" id="terms-self-hosted">
            <span className="policy-block__icon policy-block__icon--green">
              <Server size={28} />
            </span>
            <div>
              <h2>2. Mô hình self-hosted</h2>
              <p>
                App kết nối trực tiếp tới domain do bạn hoặc tổ chức lựa chọn.
                Operator của domain quản lý tài khoản, nội dung, thành viên,
                moderation, retention, backup và hạ tầng instance.
              </p>
              <p>
                {config.legalEntityName} cung cấp client/portal chính thức
                nhưng không mặc nhiên sở hữu, truy cập hoặc quản trị dữ liệu
                trên server đó. Portal chỉ dùng domain để xác minh instance và
                mở đúng điểm đăng nhập/đăng ký.
              </p>
            </div>
          </section>

          <section className="policy-block" id="terms-account">
            <span className="policy-block__icon policy-block__icon--blue">
              <LockKeyhole size={28} />
            </span>
            <div>
              <h2>3. Tài khoản và bảo mật</h2>
              <ul className="check-list">
                <li>
                  Bạn phải cung cấp thông tin chính xác và giữ an toàn
                  credential của mình.
                </li>
                <li>
                  Không dùng chung phiên trái phép hoặc cố gắng truy cập tài
                  khoản, instance hay dữ liệu khi chưa được phép.
                </li>
                <li>
                  Báo ngay cho operator khi nghi ngờ bị chiếm quyền hoặc phát
                  hiện sự cố bảo mật.
                </li>
                <li>
                  Bộ phận hỗ trợ không bao giờ yêu cầu mật khẩu, OTP, access
                  token, refresh token hoặc private key.
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-block" id="terms-license">
            <span className="policy-block__icon">
              <FileText size={28} />
            </span>
            <div>
              <h2>4. Giấy phép ứng dụng và dịch vụ bên thứ ba</h2>
              <p>
                Trong thời gian tuân thủ Điều khoản, bạn được cấp quyền có giới
                hạn, không độc quyền, không chuyển nhượng để cài và sử dụng app
                cho mục đích giao tiếp/cộng tác hợp pháp.
              </p>
              <p>
                Push, cuộc gọi, đăng nhập liên kết hoặc storage có thể dựa vào
                dịch vụ do operator lựa chọn hay FCM/APNs. Điều khoản của nhà
                cung cấp đó có thể áp dụng và operator chịu trách nhiệm cấu
                hình hợp pháp, bảo mật, thông báo cho thành viên.
              </p>
            </div>
          </section>

          <section className="policy-block" id="terms-content">
            <span className="policy-block__icon policy-block__icon--green">
              <UserRound size={28} />
            </span>
            <div>
              <h2>5. Nội dung người dùng, an toàn và chấm dứt</h2>
              <p>
                Bạn giữ quyền đối với nội dung mình tạo và cam kết có quyền
                chia sẻ nội dung đó. Bạn cấp cho operator quyền kỹ thuật cần
                thiết để lưu, truyền, hiển thị, sao lưu và xử lý nội dung nhằm
                vận hành instance.
              </p>
              <p>
                Nội dung/hành vi phải tuân thủ{" "}
                <a href={portalPath(config, "/acceptable-use")}>
                  Chính sách sử dụng hợp lệ
                </a>
                . Operator có thể điều tra, ẩn nội dung, giới hạn tính năng,
                đình chỉ hoặc xóa tài khoản khi có vi phạm nghiêm trọng.
              </p>
              <p>
                Bạn có thể ngừng sử dụng và xóa tài khoản bất cứ lúc nào tại{" "}
                <a href={portalPath(config, "/account-deletion")}>
                  trang xóa tài khoản
                </a>
                .
              </p>
            </div>
          </section>

          <section className="policy-block" id="terms-contact">
            <span className="policy-block__icon policy-block__icon--coral">
              <Globe2 size={28} />
            </span>
            <div>
              <h2>6. Cam kết, luật áp dụng và liên hệ</h2>
              <p>
                Dịch vụ được cung cấp theo khả năng hiện có; không thể bảo đảm
                mọi instance hoặc mạng bên thứ ba luôn không gián đoạn. Không
                nội dung nào trong Điều khoản loại trừ trách nhiệm không được
                phép loại trừ hoặc quyền người tiêu dùng bắt buộc.
              </p>
              <p>
                Điều khoản được giải thích theo pháp luật áp dụng đối với{" "}
                {config.legalEntityName} tại {config.legalCountry}, đồng thời
                tôn trọng quyền bắt buộc tại nơi người dùng cư trú.
              </p>
              <p>
                Trước khi khởi kiện, các bên nên gửi thông báo tới{" "}
                <a href={`mailto:${config.supportEmail}`}>
                  {config.supportEmail}
                </a>{" "}
                để có cơ hội giải quyết thiện chí.
              </p>
            </div>
          </section>
        </div>
      </article>

      <SiteFooter config={config} />
    </main>
  );
}
