# Homepage – Portal Headhunter

## Target Users

- Guest (chưa đăng nhập)
- Candidate (đã đăng nhập)

## Main Goal

- Giúp người dùng tìm việc nhanh chóng
- Thu hút đăng ký tài khoản
- Tăng engagement qua news & company

## Layout Structure

1. Navbar
2. Hero Search
3. Recommended Jobs (conditional)
4. Featured Jobs
5. Top Companies
6. News & Events
7. Footer

### Navbar

Elements:

- Logo (click → homepage)
- Menu: Tìm việc | Tin tức | Forum
- Auth Area:
  - Guest: Đăng nhập | Đăng ký
  - Logged-in: Avatar + Dropdown (Cài đặt, Đổi mật khẩu, Đăng xuất)

UX Decision:

- Nút Đăng ký nổi bật hơn Đăng nhập.
- Dropdown có icon rõ ràng.

### Hero Search

Fields:

- Keyword input
- Location
- Search button
- Advanced Filter (Industry, Salary, Level)

UX Decision:

- Chỉ hiển thị Keyword + Location mặc định.
- Filter nâng cao ẩn để tránh rối giao diện.
- Search button rõ ràng, nổi bật.

### Recommended Jobs

Condition:

- Chỉ hiển thị khi Candidate đăng nhập.

Display:

- Job Title
- Company
- Location
- Salary
- Match Score (%)

UX Decision:

- Dạng card ngang (carousel).
- Có label “Recommended for you”.

### Featured Jobs

Display:

- 6 job đầu tiên
- Button “View more”

Logic:

- Sắp xếp theo độ mới + độ phổ biến.

### Top Companies

Display:

- Logo
- Company Name
- Short description
- Number of open jobs

### News & Events

Layout:

- Grid 3 cột
- Image + Title
- Click → Detail

### Footer

Links:

- Về chúng tôi
- Liên hệ
- Điều khoản
- Chính sách

## Proposed Improvements

1. Hero search nên tối giản để tránh overload người dùng.
2. Recommended nên hiển thị match score để tăng tính cá nhân hóa.
3. Featured chỉ hiển thị 6 job để giữ trang gọn.
4. Có thể thêm CTA “Upload CV” cho Guest.
5. Nên lazy-load News để tối ưu performance.

## Conditional Rendering

Guest:

- Không thấy Recommended Jobs
- Thấy Đăng ký / Đăng nhập

Candidate:

- Thấy Recommended
- Thấy Avatar dropdown

Recruiter:

- Không cần Recommended section
