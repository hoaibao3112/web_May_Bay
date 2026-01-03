import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  // Xuất vé
  @Post('issue')
  async issueTicket(@Body() body: { bookingId: number }) {
    return this.ticketsService.issueTicket(body.bookingId);
  }

  // Lấy thông tin vé theo số vé
  @Get(':soVe')
  async getTicket(@Param('soVe') soVe: string) {
    return this.ticketsService.getTicketByNumber(soVe);
  }

  // Lấy tất cả vé của booking
  @Get('booking/:bookingId')
  async getTicketsByBooking(@Param('bookingId') bookingId: string) {
    return this.ticketsService.getTicketsByBooking(+bookingId);
  }
}
