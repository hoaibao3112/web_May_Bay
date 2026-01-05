import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { SearchModule } from './search/search.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './tickets/tickets.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SeatsModule } from './seats/seats.module';
import { CheckinModule } from './checkin/checkin.module';
import { BaggageModule } from './baggage/baggage.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HotelsModule } from './hotels/hotels.module';
import { TestDbController } from './test-db.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    CatalogModule,
    SearchModule,
    BookingsModule,
    PaymentsModule,
    TicketsModule,
    StatisticsModule,
    SeatsModule,
    CheckinModule,
    BaggageModule,
    PromotionsModule,
    ReviewsModule,
    NotificationsModule,
    HotelsModule,
  ],
  controllers: [TestDbController],
})
export class AppModule {}

