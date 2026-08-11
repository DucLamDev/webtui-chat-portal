# Store listing assets

Các file trong `play/` được tạo deterministic bằng:

```sh
npm run assets:store
npm run assets:check
```

Nguồn upload hiện tại là logo brand gốc và hai screenshot phone thật. Generator
chỉ resize/pad/composite; icon được flatten trên nền trắng vì chữ W của source
là transparent cut-out, sau đó giữ kênh alpha để tạo PNG 32-bit đúng contract
của Play. Không dùng image generation, không kéo giãn logo và không biến
screenshot phone thành giao diện tablet giả.

## File để upload Google Play

- `play/icon-512.png`: icon 512×512, PNG 32-bit RGBA.
- `play/feature-graphic-1024x500.png`: feature graphic 1024×500, không alpha.
- `play/phone/01-chat-432x864.png`: màn hình hội thoại, tỷ lệ 1:2.
- `play/phone/02-conversations-432x864.png`: danh sách hội thoại, tỷ lệ 1:2.
- `play/manifest.json`: kích thước, SHA-256 nguồn/output và script tạo.

Hai ảnh phone đáp ứng mức bắt buộc tối thiểu hai screenshot để xuất bản Store
Listing. Để đủ điều kiện hiển thị tốt trên các bề mặt đề xuất, cần chụp ít nhất
bốn ảnh thật ở độ phân giải tối thiểu 1080 px, tỷ lệ 9:16 hoặc 16:9.

Không upload `source/tablet-chat.png`. Ảnh này chỉ là capture tham chiếu
1024×768 (4:3), không đạt contract của mục tablet/Chromebook. Nếu điền mục
large-screen trong Play Console, phải chụp ít nhất bốn màn hình thật của đúng
AAB, mỗi ảnh 1080–7680 px và tỷ lệ 9:16 hoặc 16:9. Generator cố ý xóa/từ chối
output tablet 1024×768 cũ. Yêu cầu hiện hành:
https://support.google.com/googleplay/android-developer/answer/9866151

Phải chụp lại screenshot khi UI/brand hoặc ngôn ngữ của bản phát hành thay đổi.
Không upload screenshot nếu màn hình đó không còn đúng với AAB đang gửi review.
Google Play vẫn cần nội dung Store Listing, mô tả, phân loại và Data safety được
điền trong Console; các PNG không thay thế các bước đó.

Các source PNG thật đã được commit trong `store-assets/source` nên CI không phụ
thuộc checkout mobile. Khi cập nhật nguồn từ nơi khác, có thể xóa source cũ rồi
truyền đường dẫn mới:

```sh
STORE_PHONE_CONVERSATIONS_SCREENSHOT_SOURCE=/path/phone.png \
npm run assets:store
```
