export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-6 py-12">
            <h1 className="text-4xl font-bold mb-8">Chính sách bảo vệ dữ liệu</h1>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Thu thập thông tin</h2>
                    <p className="text-gray-700">
                        BayNhanh thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt vé, hoặc sử dụng các dịch vụ của chúng tôi.
                        Thông tin có thể bao gồm: họ tên, email, số điện thoại, thông tin thanh toán.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Sử dụng thông tin</h2>
                    <p className="text-gray-700">
                        Chúng tôi sử dụng thông tin của bạn để:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700">
                        <li>Xử lý đơn đặt vé máy bay, khách sạn</li>
                        <li>Gửi thông báo về chuyến đi của bạn</li>
                        <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                        <li>Tuân thủ các quy định pháp luật</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Bảo mật thông tin</h2>
                    <p className="text-gray-700">
                        BayNhanh cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiên tiến.
                        Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba trừ khi có sự đồng ý của bạn hoặc theo yêu cầu pháp lý.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Quyền của bạn</h2>
                    <p className="text-gray-700">
                        Bạn có quyền truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào.
                        Vui lòng liên hệ với chúng tôi qua email: support@baynhanh.com
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Cookie</h2>
                    <p className="text-gray-700">
                        Website của chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng.
                        Bạn có thể tắt cookie trong cài đặt trình duyệt của mình.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Thay đổi chính sách</h2>
                    <p className="text-gray-700">
                        Chúng tôi có thể cập nhật chính sách này theo thời gian.
                        Mọi thay đổi sẽ được thông báo trên trang web của chúng tôi.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Liên hệ</h2>
                    <p className="text-gray-700">
                        Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo vệ dữ liệu này, vui lòng liên hệ:
                    </p>
                    <p className="text-gray-700 mt-2">
                        Email: support@baynhanh.com<br />
                        Hotline: 1900 1234
                    </p>
                </section>
            </div>
        </div>
    );
}
