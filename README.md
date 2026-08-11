# WebTUI Chat Portal

Portal public của WebTUI Chat dùng để discovery instance self-hosted, phân phối
client và công bố các tài liệu bắt buộc cho Google Play/App Store. Portal không
nhận mật khẩu, access token, refresh token hoặc nội dung chat của instance.

## Chạy local

Yêu cầu Node.js 24 và npm 11:

```sh
npm ci
cp deploy/.env.example .env.local
```

Điền **giá trị pháp nhân và retention thực** trong `.env.local`; validator cố ý
từ chối biến trống, `CHANGE_ME`, `TODO`, giá trị sai định dạng và certificate
fingerprint không hợp lệ. Sau đó:

```sh
npm run dev
```

Các gate trước khi merge/release:

```sh
npm run assets:check
npm run typecheck
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

## Public store endpoints

- `/privacy`: Privacy Policy canonical, có pháp nhân/controller, UGC và retention.
- `/account-deletion`: xóa trong app hoặc gửi yêu cầu mà không cần cài app.
- `/terms`: Terms of Use.
- `/acceptable-use`: Acceptable Use/UGC moderation policy.
- `/support`: support URL ổn định cho Store metadata, có ba đầu mối và SLA mục tiêu.
- `/.well-known/assetlinks.json`: Android Digital Asset Links.
- `/.well-known/apple-app-site-association`: iOS Universal Links, chỉ công bố khi
  `ENABLE_IOS_ASSOCIATION=true`.

`assetlinks.json` luôn phải trả `200` trực tiếp, JSON đúng content type, không
redirect, trên **đúng host được khai báo trong Android app**. File này dùng SHA-256
của **Play App Signing key certificate** tại Play Console → App integrity, không
dùng upload key/keystore local. Với bản chỉ phát hành CH-Play, đặt
`ENABLE_IOS_ASSOCIATION=false`, để trống cả hai biến Apple; AASA phải trả `404`
(hoặc `410` ở ingress ngoài). Chỉ bật cờ sau khi có Team ID, bundle ID thật và
Associated Domain trùng khớp trong app iOS đã ký; khi đó AASA phải trả `200` trực tiếp.

Host này do publisher kiểm soát và là host tĩnh của official universal binary.
Domain self-host của customer được user nhập thủ công; customer không copy/proxy
association payload của official app lên domain của họ. Android Dynamic App Links
không thêm arbitrary customer host ngoài host đã khai báo trong manifest.

Nếu `APP_LINK_ORIGIN` khác `PORTAL_ORIGIN` (cấu hình mặc định là
`chat.vpsttt.com` và `download.vpsttt.com`), backend/app host phải trả trực tiếp
Android assetlinks bằng payload từ portal (không redirect). Route AASA phải giữ
`404/410` khi iOS bị tắt, hoặc trả đúng payload khi iOS được bật. Self-host compose
không có service portal; xem topology tại [deploy/README.md](deploy/README.md).

## Trách nhiệm self-hosted

- Operator của domain chat kiểm soát tài khoản, UGC, moderation, retention,
  backup và yêu cầu dữ liệu trên instance.
- Pháp nhân phát hành chịu trách nhiệm cho app/portal chính thức và relay mà họ
  trực tiếp vận hành.
- Legal Policy Contract v1 yêu cầu portal versions khớp chính xác Terms/Privacy
  versions từ `/api/v1/auth/legal-documents`; đổi policy phải deploy portal,
  backend config và store disclosure trong cùng release plan.
- Thời hạn account deletion và moderation-evidence là biến bắt buộc, phải khớp
  implementation. Nội dung workspace, security log và backup thuộc operator;
  policy không được bịa một thời hạn chung mà operator không thực thi.
- `POLICY_VERSION` phải khớp tuyệt đối với version Terms/Privacy mà backend/mobile
  lưu khi người dùng chấp thuận (release hiện tại: `2026-08-07`).
- UGC report/block phải tồn tại trong app/backend trước khi phát hành policy mô
  tả chức năng đó; policy không thay thế implementation moderation.
- `MOBILE_SUPPORT_URL` của backend/mobile nên đặt thành canonical
  `https://<PORTAL_DOMAIN>/support`, không dùng homepage hay mailto làm Store URL.

## Store listing assets

Asset Google Play nằm trong [`store-assets/play`](store-assets/play) và được tạo
từ logo/screenshot thật bằng Sharp, không dùng AI. Chạy `npm run assets:store`
khi nguồn thay đổi và commit cả `manifest.json`. Xem
[`store-assets/README.md`](store-assets/README.md).

## Deploy

Copy `deploy/.env.example` thành `.env`, điền giá trị thật rồi chạy:

```sh
cd deploy
docker compose --env-file .env -f compose.yml config --quiet
docker compose --env-file .env -f compose.yml up -d --build
```

Build Docker sẽ dừng nếu thiếu legal identity, contact, account/moderation
retention, Play signing certificate hoặc URL Play thật. Apple identity chỉ bắt
buộc khi `ENABLE_IOS_ASSOCIATION=true`; khi cờ là `false`, hai biến Apple phải trống.
APK do
CI ký bằng upload key không được dùng làm public fallback nếu khác Play
app-signing certificate. TLS/DNS là trạng thái bên ngoài source; luôn chạy
`npm run check:production` và kiểm tra từ mạng Internet sau deploy.

Không commit `.env`, keystore, `key.properties`, APNs key, service account hoặc
credential production.
