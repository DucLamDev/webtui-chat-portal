# Deploy portal production

Portal thường chạy tại `download.webtui.vn`; app/deep-link host thường là
`chat.vpsttt.com`. `webtui-chat-self-host/deploy/self-hosted/compose.yml` **không
có service portal** và không build repo này. Portal được deploy độc lập bằng
`webtui-chat-portal/deploy/compose.yml` trên host/ingress phù hợp.

DNS, TLS, email inbox, Play/App Store identity và dữ liệu pháp nhân là external
state: source chỉ có thể validate cấu hình và fail closed.

## 1. DNS, TLS và cổng

Tạo bản ghi `A/AAAA` đúng cho từng host, mở `80/tcp`, `443/tcp`, `443/udp` và
đảm bảo không có reverse proxy khác chiếm cổng. Caddy tự cấp/gia hạn TLS. Nếu dùng
Cloudflare, dùng `Full (strict)` và kiểm tra origin certificate chain.

Không đưa URL policy vào Store Console trước khi các lệnh sau trả `200` qua mạng
ngoài, certificate hợp lệ và không có interstitial/login:

```sh
curl -fSsI https://download.webtui.vn/privacy
curl -fSsI https://download.webtui.vn/account-deletion
curl -fSsI https://download.webtui.vn/terms
curl -fSsI https://download.webtui.vn/acceptable-use
curl -fSsI https://download.webtui.vn/support
```

## 2. Cấu hình compliance bắt buộc

```sh
cd deploy
cp .env.example .env
chmod 600 .env
```

Phải thay toàn bộ `CHANGE_ME`. Các trường sau phải được duyệt bởi người chịu
trách nhiệm pháp lý/operations và phải khớp backend:

- `LEGAL_ENTITY_*`, ba email support/privacy/safety;
- `POLICY_VERSION`, `POLICY_EFFECTIVE_DATE` (version phải khớp chính xác giá trị
  backend/mobile ghi nhận khi người dùng chấp thuận; release hiện tại dùng `2026-08-07`);
- thời hạn account deletion và `MODERATION_EVIDENCE_RETENTION_DAYS` (phải khớp
  worker backend); operator phải công bố riêng lịch backup, lịch lưu security/
  audit log và nội dung workspace đã tách khỏi tài khoản active;
- mục tiêu phản hồi UGC report;
- mục tiêu phản hồi hỗ trợ kỹ thuật (`SUPPORT_RESPONSE_HOURS`);
- Play App Signing SHA-256; Apple Team ID/bundle ID chỉ khi phát hành iOS;
- `MOBILE_DOWNLOAD_URL` là Play Internal/Closed/production URL thật; không trỏ
  vào CI upload-key APK;
- `PORTAL_ORIGIN` và `APP_LINK_ORIGIN`.

Fingerprint Android lấy tại **Play Console → Setup → App integrity → App signing
key certificate → SHA-256** sau khi bật Play App Signing. Không lấy fingerprint
của upload keystore. Nếu Google xoay signing key và còn hỗ trợ app cũ, đặt cả hai
fingerprint, phân cách bằng dấu phẩy.

Chọn đúng một profile association; không điền Apple ID giả để vượt build:

```dotenv
# CH-Play only (mặc định an toàn)
ENABLE_IOS_ASSOCIATION=false
APPLE_TEAM_ID=
APPLE_BUNDLE_ID=
```

Chỉ sau khi có app iOS đã ký, Associated Domains đã bật và identity thật từ Apple
Developer mới đổi `ENABLE_IOS_ASSOCIATION=true`, rồi điền trực tiếp Team ID và
bundle ID thật vào hai biến Apple. Tài liệu không cung cấp giá trị giả để copy.
Validator yêu cầu Apple identity trống khi cờ là `false`, và yêu cầu đủ/đúng định
dạng khi cờ là `true`.

## 3. App Links/Universal Links trên đúng host

`APP_LINK_ORIGIN` luôn phải giống `MOBILE_APP_LINK_HOST`/Android manifest host.
Khi `ENABLE_IOS_ASSOCIATION=true`, host này cũng phải tồn tại trong iOS Associated
Domains. Association file đang bật không được redirect.

Đây là publisher-controlled host cho official binary, không phải template để
mỗi customer thay bằng domain self-host. User nhập customer domain thủ công;
chỉ custom-branded build có manifest/signing/Firebase riêng mới dùng host khác.

Nếu app-link host chính là portal host, `deploy/Caddyfile` đã phục vụ đúng route.
Nếu app-link host là `chat.vpsttt.com`, backend của official instance proxy **nội
dung** Android assetlinks từ `PORTAL_ORIGIN`; client vẫn phải nhận trực tiếp HTTP
`200` tại chat host, không nhận redirect 3xx sang download host. Với AASA, host đó
phải giữ `404/410` khi iOS bị tắt, hoặc proxy đúng JSON và trả `200` khi iOS được
bật. Không proxy toàn bộ `/.well-known/*` vì discovery/API khác của instance vẫn
thuộc backend.

Self-host stack không được cấu hình upstream `portal:3002`: service đó không tồn
tại trong compose self-host. Upstream là HTTPS public `PORTAL_ORIGIN` (hoặc một
portal upstream được người vận hành chủ động nối vào ingress). Test output:

```sh
curl -fSsD - https://chat.vpsttt.com/.well-known/assetlinks.json
curl -sS -o /dev/null -w '%{http_code}\n' \
  https://chat.vpsttt.com/.well-known/apple-app-site-association
```

Assetlinks phải là `HTTP 200`, `Content-Type: application/json`, package
`com.vpsttt.webtui_chat` và Play signing SHA-256 đúng. AASA phải là `404/410` cho
Play-only; nếu iOS được bật thì phải là `200`, JSON chứa duy nhất Apple App ID/path
đã cấu hình. Dùng Android:

```sh
adb shell pm verify-app-links --re-verify com.vpsttt.webtui_chat
adb shell pm get-app-links com.vpsttt.webtui_chat
```

## 4. Build và deploy

```sh
cd webtui-chat-portal/deploy
docker compose --env-file .env -f compose.yml config --quiet
docker compose --env-file .env -f compose.yml build --pull portal
docker compose --env-file .env -f compose.yml up -d
docker compose --env-file .env -f compose.yml ps
docker compose --env-file .env -f compose.yml logs --tail=200 portal caddy
```

`compose config` yêu cầu biến tồn tại; `npm run build` trong image tiếp tục kiểm
tra format và placeholder. Healthcheck portal phải healthy trước khi Caddy được
coi là sẵn sàng.

`deploy/compose.yml` là stack standalone và Caddy của nó publish `80/443`. Nếu
stack chat trên cùng máy đã sở hữu các cổng này, không chạy Caddy thứ hai: deploy
portal trên host khác hoặc chủ động tích hợp **service portal của repo này** vào
reverse proxy hiện hữu. Không chạy lệnh build portal từ compose self-host vì
compose đó không khai báo service/build context portal.

## 5. Post-deploy gate

Từ checkout đã nạp cùng `.env` production:

```sh
set -a
. deploy/.env
set +a
npm run check:production
```

Gate kiểm tra 5 public support/policy pages, Android association bắt buộc và trạng
thái/payload AASA đúng với `ENABLE_IOS_ASSOCIATION`; đồng thời kiểm tra content type
và việc không redirect. Sau đó kiểm tra thêm:

- TLS renewal/log của Caddy;
- inbox `support@`, `privacy@`, `safety@` nhận và phản hồi được;
- report/block/xóa tài khoản end-to-end trên reviewer account;
- URL trong Play Console/App Store Connect khớp canonical production;
- app link trên bản cài từ Play Internal testing/TestFlight (không chỉ debug).

## 6. Artifact download

`/download/` mặc định Play-first. `/downloads/files/` chỉ được chứa universal APK
xuất từ Play hoặc artifact đã xác minh có signer trùng chính xác Play app-signing
SHA-256, kèm checksum/manifest tạo từ chính file đó. CI upload-key APK chỉ dùng
để kiểm tra trong job, không được giữ/public. Không đưa keystore, `key.properties`, Firebase
service account, APNs key, tester list hoặc secret vào `download/` hay Docker
image.
