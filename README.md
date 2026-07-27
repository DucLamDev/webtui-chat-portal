# WebTUI Chat Portal

Portal trung tâm chạy tại `https://download.vpsttt.com`. Portal kiểm tra
discovery của instance customer, cung cấp tài liệu/download và điều hướng người
dùng sang đúng domain để đăng ký hoặc đăng nhập.

Portal không nhận mật khẩu, access token, refresh token hoặc dữ liệu chat.

```sh
npm ci
npm test
npm run build
```

Triển khai Docker độc lập:

```sh
cd deploy
cp .env.example .env
docker compose --env-file .env -f compose.yml up -d --build
```
