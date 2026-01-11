import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

@Injectable()
export class ChatbotService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private conversationHistories: Map<string, ChatMessage[]> = new Map();

    constructor() {
        // Initialize Gemini AI with API key from environment
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            console.error('⚠️ GEMINI_API_KEY not found in environment variables!');
        } else {
            console.log('🔑 API Key loaded:', apiKey.substring(0, 15) + '...');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log('✅ Gemini AI initialized');
    }

    private getSystemPrompt(): string {
        return `Bạn là trợ lý ảo thông minh của BayNhanh - nền tảng đặt vé máy bay, khách sạn và dịch vụ du lịch hàng đầu Việt Nam.

🎯 NHIỆM VỤ CỦA BẠN:
- Tư vấn chuyến bay phù hợp dựa trên ngân sách, thời gian, điểm đến của khách
- So sánh giá vé giữa các hãng hàng không (VietJet, Vietnam Airlines, Bamboo Airways)
- Gợi ý các điểm đến du lịch hấp dẫn trong và ngoài nước
- Hướng dẫn quy trình đặt vé online trên BayNhanh
- Trả lời các câu hỏi về dịch vụ: đặt khách sạn, thuê xe, đưa đón sân bay
- Tư vấn về hành lý, giấy tờ cần thiết khi đi máy bay

💡 PHONG CÁCH GIAO TIẾP:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời NGẮN GỌN, dễ hiểu (2-4 câu mỗi lần)
- Sử dụng emoji phù hợp để sinh động
- Dùng tiếng Việt chuẩn, không viết tắt
- Hỏi lại nếu thông tin chưa rõ

📊 THÔNG TIN GIÁ VÉ THAM KHẢO:
- Hà Nội ↔ TP.HCM: 800,000 - 2,500,000 VNĐ
- Hà Nội ↔ Đà Nẵng: 600,000 - 1,800,000 VNĐ
- TP.HCM ↔ Đà Nẵng: 500,000 - 1,500,000 VNĐ
- TP.HCM ↔ Phú Quốc: 700,000 - 2,000,000 VNĐ
- Quốc tế (Bangkok, Singapore): từ 2,000,000 VNĐ

🏖️ ĐIỂM ĐẾN PHỔ BIẾN:
- Trong nước: Đà Nẵng, Phú Quốc, Nha Trang, Đà Lạt, Quy Nhơn
- Nước ngoài: Bangkok, Singapore, Seoul, Tokyo, Bali

⚠️ GIỚI HẠN:
- KHÔNG đưa ra lời khuyên y tế hoặc pháp lý
- KHÔNG đặt vé thay khách (chỉ hướng dẫn)
- KHÔNG tiết lộ thông tin cá nhân khách hàng

Hãy trả lời một cách thân thiện và hữu ích!`;
    }

    async sendMessage(sessionId: string, userMessage: string): Promise<string> {
        try {
            // Get or create conversation history
            if (!this.conversationHistories.has(sessionId)) {
                this.conversationHistories.set(sessionId, []);
            }

            const history = this.conversationHistories.get(sessionId)!;

            // Start chat with history
            const chat = this.model.startChat({
                history: history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }],
                })),
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                },
            });

            // Add system context if first message
            let messageToSend = userMessage;
            if (history.length === 0) {
                messageToSend = `${this.getSystemPrompt()}\n\nKhách hàng hỏi: ${userMessage}`;
            }

            // Send message and get response
            const result = await chat.sendMessage(messageToSend);
            const response = result.response;
            const text = response.text();

            // Save to history
            history.push({ role: 'user', parts: userMessage });
            history.push({ role: 'model', parts: text });

            // Limit history to last 20 messages
            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }

            return text;
        } catch (error) {
            console.error('❌ Gemini API Error:', error.message);
            // Return intelligent fallback responses
            return this.getFallbackResponse(userMessage);
        }
    }

    private getFallbackResponse(message: string): string {
        const msg = message.toLowerCase();

        // Greetings
        if (msg.includes('xin chào') || msg.includes('hello') || msg.includes('hi')) {
            return 'Xin chào! 👋 Tôi là trợ lý ảo của BayNhanh. Hiện tại hệ thống AI đang được cập nhật, nhưng tôi vẫn có thể hỗ trợ bạn! Bạn muốn biết thông tin gì về chuyến bay?';
        }

        // Flight prices
        if ((msg.includes('giá') || msg.includes('vé')) && (msg.includes('nào') || msg.includes('sài gòn') || msg.includes('hà nội') || msg.includes('đà nẵng'))) {
            if (msg.includes('hà nội') && msg.includes('sài gòn')) {
                return '✈️ Giá vé Hà Nội - TP.HCM:\n\n💰 VietJet: 800K - 1.2M VNĐ\n✈️ Vietnam Airlines: 1.5M - 2.5M VNĐ  \n🎋 Bamboo Airways: 1M - 1.8M VNĐ\n\nGiá vé thay đổi theo ngày giờ bay. Bạn muốn đặt vé ngay không? 😊';
            }
            if (msg.includes('đà nẵng')) {
                return '🏖️ Giá vé đến Đà Nẵng:\n\n📍 Từ HN: 600K - 1.8M VNĐ\n📍 Từ SGN: 500K - 1.5M VNĐ\n\nĐà Nẵng là điểm đến tuyệt vời với biển đẹp và ẩm thực hấp dẫn! Bạn dự định đi khi nào? 🌊';
            }
            return '💰 Giá vé máy bay phụ thuộc vào:\n- Điểm đi và điểm đến\n- Ngày giờ bay\n- Hãng hàng không\n\nVui lòng cho tôi biết bạn muốn bay từ đâu đến đâu để tôi tư vấn cụ thể hơn! ✈️';
        }

        // Destination suggestions
        if (msg.includes('gợi ý') || msg.includes('đi đâu') || msg.includes('điểm đến')) {
            return '🏖️ Gợi ý điểm đến HOT:\n\n**Trong nước:**\n🌊 Phú Quốc - Thiên đường biển đảo\n🏰 Đà Nẵng - Thành phố đáng sống  \n🌸 Đà Lạt - Thành phố ngàn hoa\n\n**Quốc tế:**\n🇹🇭 Bangkok - Mua sắm và ẩm thực\n🇸🇬 Singapore - Hiện đại và sạch đẹp\n\nBạn thích kiểu du lịch nào: biển, núi hay đô thị? 🗺️';
        }

        // Booking guide
        if (msg.includes('đặt vé') || msg.includes('booking') || msg.includes('hướng dẫn')) {
            return '📝 Hướng dẫn đặt vé trên BayNhanh:\n\n1️⃣ Chọn điểm đi - điểm đến\n2️⃣ Chọn ngày bay\n3️⃣ Chọn số hành khách\n4️⃣ Tìm kiếm chuyến bay  \n5️⃣ Chọn chuyến bay phù hợp\n6️⃣ Điền thông tin hành khách\n7️⃣ Thanh toán\n\nRất đơn giản! Bạn cần hỗ trợ thêm không? 😊';
        }

        // Phú Quốc
        if (msg.includes('phú quốc')) {
            return '🏝️ Phú Quốc - đảo ngọc tuyệt đẹp!\n\n💰 Giá vé từ SGN: 700K - 2M VNĐ\n🌤️ Thời gian tốt nhất: Tháng 11 - tháng 4\n🏖️ Điểm tham quan: Vinpearl, Hòn Thơm, Chợ đêm\n\nBạn muốn đặt vé đi Phú Quốc không? ✈️';
        }

        // Default response
        return '🤖 Tôi là trợ lý ảo của BayNhanh!\n\nTôi có thể giúp bạn:\n✈️ Tư vấn chuyến bay\n💰 So sánh giá vé\n🏖️ Gợi ý điểm đến\n📝 Hướng dẫn đặt vé\n\nHiện hệ thống AI đang cập nhật, một số tính năng có thể bị giới hạn. Vui lòng cho tôi biết bạn cần hỗ trợ gì! 😊';
    }

    clearConversation(sessionId: string): void {
        this.conversationHistories.delete(sessionId);
    }

    getSuggestions(): string[] {
        return [
            '✈️ Gợi ý điểm đến du lịch tháng này',
            '💰 So sánh giá vé Hà Nội - Sài Gòn',
            '🏖️ Du lịch Phú Quốc nên đi vào tháng mấy?',
            '📝 Hướng dẫn đặt vé như thế nào?',
            '🎒 Quy định hành lý xách tay',
        ];
    }
}
