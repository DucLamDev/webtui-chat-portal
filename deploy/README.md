# Deploy portal tại download.vpsttt.com

Portal production được chạy chung VPS và chung Caddy với backend/frontend chat.
Không chạy `webtui-chat-portal/deploy/compose.yml` song song với stack chat vì
hai compose sẽ cùng chiếm cổng `80/443`. Stack hợp nhất nằm tại
`webtui-chat-self-host/deploy/self-hosted/compose.yml`.

## 1. Chuẩn bị DNS và firewall

Tạo hai bản ghi cùng trỏ về IPv4 public của VPS:

```text
A  chat.vpsttt.com      -> <VPS_PUBLIC_IP>
A  download.vpsttt.com  -> <VPS_PUBLIC_IP>
```

Mở `80/tcp`, `443/tcp` và `443/udp`. Caddy tự xin và gia hạn TLS cho cả hai
subdomain. Nếu dùng Cloudflare, đặt SSL/TLS ở `Full (strict)`; lúc khởi tạo có
thể tắt proxy để kiểm tra cấp chứng chỉ dễ hơn.

## 2. Đặt source đúng cấu trúc

Compose dùng build context tương đối nên hai repository phải là thư mục anh em:

```text
/opt/vpsttt-suite/
├── webtui-chat-self-host/
└── webtui-chat-portal/
```

Ví dụ:

```sh
sudo mkdir -p /opt/vpsttt-suite
sudo chown "$USER":"$USER" /opt/vpsttt-suite
cd /opt/vpsttt-suite
git clone <SELF_HOST_REPOSITORY_URL> webtui-chat-self-host
git clone <PORTAL_REPOSITORY_URL> webtui-chat-portal
```

## 3. Cấu hình production

```sh
cd /opt/vpsttt-suite/webtui-chat-self-host/deploy/self-hosted
cp .env.example .env
chmod 600 .env
```

Trong `.env`, tối thiểu kiểm tra:

```dotenv
INSTANCE_DOMAIN=chat.vpsttt.com
APP_URL=https://chat.vpsttt.com
PORTAL_DOMAIN=download.vpsttt.com
PORTAL_ORIGIN=https://download.vpsttt.com
DESKTOP_DOWNLOAD_URL=https://download.vpsttt.com/download/
MOBILE_DOWNLOAD_URL=https://download.vpsttt.com/download/
DOCUMENTATION_URL=https://download.vpsttt.com/#self-host
CORS_ALLOWED_ORIGINS=https://chat.vpsttt.com,https://download.vpsttt.com,http://tauri.localhost,https://tauri.localhost,tauri://localhost
LETSENCRYPT_EMAIL=admin@vpsttt.com
```

Không dùng các giá trị `CHANGE_ME` ở production. Với instance mới nên chạy
`install.sh` để tự sinh password/secret:

```sh
sh install.sh \
  --domain chat.vpsttt.com \
  --email admin@vpsttt.com \
  --name "VPSTTT Chat" \
  --portal-origin https://download.vpsttt.com
```

Với instance đã có `.env` và dữ liệu, không chạy `--force`; bổ sung các biến
portal vào `.env`, sau đó dùng các lệnh ở bước 4.

## 4. Build và deploy

Kiểm tra cấu hình trước:

```sh
docker compose --env-file .env -f compose.yml config
```

Deploy toàn stack:

```sh
docker compose --env-file .env -f compose.yml build --pull
docker compose --env-file .env -f compose.yml up -d
```

Nếu backend/frontend đang chạy và chỉ cập nhật portal:

```sh
docker compose --env-file .env -f compose.yml build portal
docker compose --env-file .env -f compose.yml up -d portal caddy
```

Kiểm tra:

```sh
docker compose --env-file .env -f compose.yml ps
docker compose --env-file .env -f compose.yml logs --tail=200 portal caddy
curl -I https://download.vpsttt.com/
curl -I https://download.vpsttt.com/download/
curl -fsS https://chat.vpsttt.com/ready
```

Kết quả đúng là portal trả `200`, `/download` chuyển `308` sang `/download/`,
và health backend trả thành công.

## 5. Phát hành APK bằng link trực tiếp

Đặt file release đã ký tại:

```text
webtui-chat-portal/download/android/stable/app-prod-release.apk
webtui-chat-portal/download/android/stable/app-prod-release.apk.sha256
webtui-chat-portal/download/android/stable/mobile-release-manifest.json
```

Tạo checksum:

```sh
cd /opt/vpsttt-suite/webtui-chat-portal/download/android/stable
sha256sum app-prod-release.apk > app-prod-release.apk.sha256
```

Cập nhật `version`, `version_code`, `checksum_sha256` và `release_notes` trong
manifest. Link APK production là:

```text
https://download.vpsttt.com/downloads/files/android/stable/app-prod-release.apk
```

Thư mục download được bind-mount read-only vào Caddy nên thay APK/manifest không
cần build lại image. Không đưa keystore, `key.properties`, Firebase service
account hoặc API key vào thư mục public.

## 6. Phân luồng request

- `chat.vpsttt.com`: web, `/admin`, API, WebSocket và logo branding.
- `download.vpsttt.com`: Next.js portal ở `/`.
- `download.vpsttt.com/download/`: trang download tĩnh.
- `download.vpsttt.com/downloads/files/`: artifact APK/desktop.

Portal chỉ thực hiện discovery domain và điều hướng; mật khẩu/token vẫn đi trực
tiếp tới instance chat.
