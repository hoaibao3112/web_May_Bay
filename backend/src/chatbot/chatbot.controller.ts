import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

interface SendMessageDto {
    sessionId: string;
    message: string;
}

@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) { }

    /**
     * Send message to chatbot
     * POST /api/chatbot/message
     */
    @Post('message')
    @HttpCode(HttpStatus.OK)
    async sendMessage(@Body() dto: SendMessageDto) {
        const response = await this.chatbotService.sendMessage(dto.sessionId, dto.message);
        return {
            success: true,
            message: response,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Get conversation starters
     * GET /api/chatbot/suggestions
     */
    @Get('suggestions')
    getSuggestions() {
        return {
            success: true,
            suggestions: this.chatbotService.getSuggestions(),
        };
    }

    /**
     * Clear conversation history
     * POST /api/chatbot/clear
     */
    @Post('clear')
    @HttpCode(HttpStatus.OK)
    clearConversation(@Body('sessionId') sessionId: string) {
        this.chatbotService.clearConversation(sessionId);
        return {
            success: true,
            message: 'Conversation cleared',
        };
    }
}
