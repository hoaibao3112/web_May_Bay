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
        // Initialize Gemini AI
        this.genAI = new GoogleGenerativeAI('AIzaSyC_5UD16JhcHeFBmx5z6Hh1mCi9PJcHkRc');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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
            console.error('Chatbot error:', error);
            return 'Xin lỗi, tôi đang gặp một chút vấn đề. Bạn có thể thử lại sau hoặc liên hệ hotline 1900-xxxx để được hỗ trợ ngay! 🙏';
        }
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
