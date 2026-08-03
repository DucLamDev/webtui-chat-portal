# WebTUI Chat Portal

Portal public của WebTUI Chat: kiểm tra discovery của một instance self-host,
đưa người dùng về đúng domain đăng ký/đăng nhập, phân phối ứng dụng và công bố
privacy/account-deletion. Portal không nhận mật khẩu, access token, refresh token
hay nội dung chat.

## Chạy local

Yêu cầu Node.js 24 và npm 11:

```sh
npm ci
npm run dev
```

Mở `http://localhost:3002`. Các gate trước khi merge:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

## Cấu hình

Các URL public được đóng vào Next.js tại build time:

| Biến | Mục đích |
| --- | --- |
| `DESKTOP_DOWNLOAD_URL` | trang tải desktop |
| `MOBILE_DOWNLOAD_URL` | trang tải mobile |
| `DOCUMENTATION_URL` | hướng dẫn self-host |
| `SUPPORT_EMAIL` | liên hệ support/privacy |
| `PORTAL_BASE_PATH` | để trống khi portal chạy ở `/`; chỉ đặt `/portal` nếu reverse proxy dùng path này |
| `PORTAL_DOMAIN` | domain Caddy xin TLS |
| `LETSENCRYPT_EMAIL` | email ACME |

Copy và chỉnh [deploy/.env.example](deploy/.env.example); không commit `.env`.

## Deploy Docker

```sh
cd deploy
cp .env.example .env
docker compose --env-file .env -f compose.yml config --quiet
docker compose --env-file .env -f compose.yml up -d --build
```

Caddy phục vụ:

- `/` — portal/onboarding;
- `/download/` — file tải và metadata release;
- `/privacy` — privacy policy public;
- `/account-deletion` — hướng dẫn/yêu cầu xóa tài khoản không cần cài app.

Privacy policy và email support phải được chủ thể pháp lý kiểm tra trước khi đưa
URL vào Google Play hoặc App Store Connect. Hướng dẫn production đầy đủ nằm tại
[deploy/README.md](deploy/README.md); cấu trúc thư mục tải nằm tại
[download/README.md](download/README.md).

## Nguyên tắc bảo mật

- Discovery chỉ nhận origin HTTPS hợp lệ và có timeout/cache hữu hạn.
- Không proxy credential đăng nhập qua portal.
- Không đặt Firebase/APNs key, keystore hay secret self-host trong image portal.
- Luôn kiểm tra link privacy/deletion từ mạng ngoài sau deploy.
