import type { Metadata } from "next";
import {
  Activity,
  CheckCircle2,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "@/components/icons";
import { PolicyIdentity, SiteFooter, SiteHeader } from "@/components/site-shell";
import {
  portalUrl,
  readPublicComplianceConfig,
} from "@/lib/public-config";

export function generateMetadata(): Metadata {
  const config = readPublicComplianceConfig();
  return {
    alternates: { canonical: portalUrl(config, "/acceptable-use") },
    description:
      "Chính sách nội dung, hành vi, báo cáo và chặn người dùng của WebTUI Chat.",
    openGraph: {
      description: "Quy tắc UGC và quy trình xử lý lạm dụng trong WebTUI Chat.",
      title: "Chính sách sử dụng hợp lệ WebTUI Chat",
      url: portalUrl(config, "/acceptable-use"),
    },
    robots: { follow: true, index: true },
    title: "Chính sách sử dụng hợp lệ",
  };
}

export default function AcceptableUsePage() {
  const config = readPublicComplianceConfig();
  return (
    <main className="policy-page acceptable-page">
      <SiteHeader config={config} label="Sử dụng hợp lệ" />

      <section className="legal-hero legal-hero--acceptable">
        <div className="legal-hero__copy">
          <p className="hero-badge">
            <ShieldCheck size={16} />
            An toàn và UGC
          </p>
          <h1>Chính sách sử dụng hợp lệ</h1>
          <p>
            Chính sách này áp dụng cho nội dung và hành vi khi sử dụng WebTUI
            Chat. Operator phải có cơ chế tiếp nhận, xem xét và xử lý báo cáo;
            người dùng có công cụ báo cáo và chặn ngay trong app.
          </p>
          <div className="legal-hero__meta">
            <a href={`mailto:${config.safetyEmail}`}>
              <Mail size={18} />
              {config.safetyEmail}
            </a>
            <span>
              <CheckCircle2 size={18} />
              Phản hồi UGC mục tiêu {config.ugcReportResponseHours} giờ
            </span>
          </div>
        </div>

        <div className="acceptable-art" aria-hidden="true">
          <div className="acceptable-art__shield">
            <ShieldCheck size={48} />
          </div>
          <div className="acceptable-art__queue acceptable-art__queue--one">
            <span />
            <span />
            <span />
          </div>
          <div className="acceptable-art__queue acceptable-art__queue--two">
            <i />
            <i />
            <i />
          </div>
          <div className="acceptable-art__report">
            <Mail size={22} />
            <span />
            <span />
          </div>
          <span className="acceptable-art__route acceptable-art__route--one" />
          <span className="acceptable-art__route acceptable-art__route--two" />
        </div>
      </section>

      <section className="policy-highlights" aria-label="Tóm tắt sử dụng hợp lệ">
        <article>
          <ShieldCheck size={30} />
          <span>
            <strong>Bảo vệ người dùng</strong>
            <small>Không chấp nhận lạm dụng, đe dọa hoặc xâm hại.</small>
          </span>
        </article>
        <article>
          <UserRound size={30} />
          <span>
            <strong>Báo cáo và chặn</strong>
            <small>Công cụ xử lý nằm trong app và queue của operator.</small>
          </span>
        </article>
        <article>
          <Activity size={30} />
          <span>
            <strong>Giảm lạm dụng hệ thống</strong>
            <small>Chặn spam, phishing, bot và truy cập trái phép.</small>
          </span>
        </article>
      </section>

      <article className="policy-document policy-document--with-nav">
        <aside className="policy-toc" aria-label="Nội dung sử dụng hợp lệ">
          <strong>Nội dung chính</strong>
          <a href="#acceptable-content">
            <ShieldCheck size={16} />
            Nội dung bị cấm
          </a>
          <a href="#acceptable-abuse">
            <LockKeyhole size={16} />
            Lạm dụng hệ thống
          </a>
          <a href="#acceptable-report">
            <Mail size={16} />
            Báo cáo và chặn
          </a>
          <a href="#acceptable-emergency">
            <Globe2 size={16} />
            Khẩn cấp
          </a>
          <a href="#acceptable-enforcement">
            <Activity size={16} />
            Xử lý
          </a>
          <a href="#acceptable-operator">
            <FileText size={16} />
            Trách nhiệm operator
          </a>
          <p>
            Báo cáo thiện chí dù không dẫn tới xử lý sẽ không bị phạt. Không
            gửi credential hoặc dữ liệu nhạy cảm không cần thiết.
          </p>
        </aside>

        <div className="policy-content">
          <PolicyIdentity config={config} />

          <section className="policy-block" id="acceptable-content">
            <span className="policy-block__icon policy-block__icon--coral">
              <ShieldCheck size={28} />
            </span>
            <div>
              <h2>1. Nội dung và hành vi bị cấm</h2>
              <ul>
                <li>
                  Bóc lột hoặc xâm hại tình dục trẻ em, dụ dỗ trẻ em, nội dung
                  tình dục liên quan người chưa thành niên hoặc hành vi gây nguy
                  hiểm cho trẻ em.
                </li>
                <li>
                  Đe dọa bạo lực đáng tin cậy, khủng bố, kích động tự hại, buôn
                  người hoặc tổ chức hoạt động gây hại ngoài đời thực.
                </li>
                <li>
                  Quấy rối có chủ đích, bắt nạt, phát tán thông tin riêng tư,
                  nội dung thù ghét hoặc phân biệt đối xử nhằm vào nhóm được bảo
                  vệ.
                </li>
                <li>
                  Nội dung tình dục không có sự đồng thuận, ảnh thân mật bị phát
                  tán trái phép hoặc bóc lột tình dục.
                </li>
                <li>
                  Lừa đảo, mạo danh gây hại, spam, phishing, phát tán malware
                  hoặc giao dịch hàng hóa/dịch vụ bất hợp pháp.
                </li>
                <li>
                  Xâm phạm quyền riêng tư, bản quyền, nhãn hiệu hoặc quyền hợp
                  pháp của người khác.
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-block" id="acceptable-abuse">
            <span className="policy-block__icon policy-block__icon--blue">
              <LockKeyhole size={28} />
            </span>
            <div>
              <h2>2. Lạm dụng hệ thống bị cấm</h2>
              <ul className="check-list">
                <li>
                  Truy cập tài khoản, instance hoặc dữ liệu khi chưa được phép.
                </li>
                <li>Né rate limit hoặc biện pháp kiểm soát.</li>
                <li>
                  Quét, khai thác lỗ hổng hay gây gián đoạn ngoài chương trình
                  kiểm thử bảo mật được cho phép bằng văn bản.
                </li>
                <li>
                  Tự động thu thập dữ liệu, gửi hàng loạt hoặc dùng bot theo
                  cách vi phạm quyền, luật hoặc quy tắc operator.
                </li>
                <li>
                  Dùng WebTUI Chat trong hệ thống mà lỗi nhắn tin có thể trực
                  tiếp gây tử vong/tổn hại nghiêm trọng nếu không có biện pháp
                  chuyên dụng và dự phòng phù hợp.
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-block" id="acceptable-report">
            <span className="policy-block__icon">
              <Mail size={28} />
            </span>
            <div>
              <h2>3. Báo cáo và chặn trong app</h2>
              <ol>
                <li>
                  Mở menu của tin nhắn hoặc hồ sơ người dùng, chọn{" "}
                  <strong>Báo cáo</strong>.
                </li>
                <li>
                  Chọn lý do, thêm mô tả/bằng chứng tối thiểu cần thiết rồi gửi.
                  Báo cáo được chuyển tới moderation queue của operator.
                </li>
                <li>
                  Chọn <strong>Chặn</strong> để ngăn tương tác trực tiếp trong
                  khi báo cáo được xem xét; có thể bỏ chặn trong phần Quyền riêng
                  tư.
                </li>
                <li>
                  Operator ghi nhận quyết định và phản hồi ban đầu trong mục
                  tiêu {config.ugcReportResponseHours} giờ.
                </li>
              </ol>
              <p>
                Báo cáo sai sự thật có chủ đích hoặc dùng công cụ report để quấy
                rối cũng là hành vi lạm dụng.
              </p>
            </div>
          </section>

          <section className="policy-block" id="acceptable-emergency">
            <span className="policy-block__icon policy-block__icon--green">
              <Globe2 size={28} />
            </span>
            <div>
              <h2>4. Tình huống khẩn cấp và báo cáo ngoài app</h2>
              <p>
                Nếu có nguy cơ tức thời, liên hệ cơ quan khẩn cấp tại nơi xảy ra
                sự việc trước. Email không phải kênh ứng cứu thời gian thực.
              </p>
              <p>
                Với bóc lột trẻ em, đe dọa nghiêm trọng hoặc khi không dùng được
                công cụ trong app, gửi domain instance, ID nội dung/người dùng
                và mô tả tối thiểu tới{" "}
                <a href={`mailto:${config.safetyEmail}`}>
                  {config.safetyEmail}
                </a>
                .
              </p>
            </div>
          </section>

          <section className="policy-block" id="acceptable-enforcement">
            <span className="policy-block__icon policy-block__icon--blue">
              <Activity size={28} />
            </span>
            <div>
              <h2>5. Xử lý và kháng nghị</h2>
              <p>
                Tùy mức độ, operator hoặc nhà phát hành trong phạm vi mình kiểm
                soát có thể cảnh báo, ẩn/xóa nội dung, giới hạn liên hệ, đình
                chỉ hoặc chấm dứt tài khoản, bảo toàn bằng chứng và báo cơ quan
                có thẩm quyền khi pháp luật yêu cầu.
              </p>
              <p>
                Quyết định xem xét bối cảnh, mức độ nguy hiểm, tiền sử và khả
                năng khắc phục. Người bị ảnh hưởng có thể gửi kháng nghị tới
                cùng kênh đã thông báo quyết định, nêu ID vụ việc và lý do cụ
                thể.
              </p>
            </div>
          </section>

          <section className="policy-block" id="acceptable-operator">
            <span className="policy-block__icon policy-block__icon--green">
              <FileText size={28} />
            </span>
            <div>
              <h2>6. Trách nhiệm của operator self-hosted</h2>
              <p>
                Operator phải công bố đầu mối moderation, giới hạn quyền truy
                cập queue, lưu audit log trong thời hạn đã công bố, huấn luyện
                moderator và xử lý yêu cầu pháp lý phù hợp.
              </p>
              <p>
                {config.legalEntityName} không tự động truy cập nội dung ở
                server của operator; nhà phát hành hỗ trợ điều tra ở cấp
                app/relay và định tuyến khi có thể.
              </p>
            </div>
          </section>
        </div>
      </article>

      <SiteFooter config={config} />
    </main>
  );
}
