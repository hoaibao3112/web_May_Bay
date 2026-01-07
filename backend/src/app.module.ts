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
import { BusCompaniesModule } from './bus-companies/bus-companies.module';
import { BusStationsModule } from './bus-stations/bus-stations.module';
import { BusSearchModule } from './bus-search/bus-search.module';
import { BusBookingsModule } from './bus-bookings/bus-bookings.module';
import { BusReviewsModule } from './bus-reviews/bus-reviews.module';
import { CarRentalSearchModule } from './car-rental-search/car-rental-search.module';
import { CarRentalBookingsModule } from './car-rental-bookings/car-rental-bookings.module';
import { CarRentalCompaniesModule } from './car-rental-companies/car-rental-companies.module';
import { CarRentalReviewsModule } from './car-rental-reviews/car-rental-reviews.module';
import { AirportTransferSearchModule } from './airport-transfer-search/airport-transfer-search.module';
import { AirportTransferBookingsModule } from './airport-transfer-bookings/airport-transfer-bookings.module';
import { AirportTransferCompaniesModule } from './airport-transfer-companies/airport-transfer-companies.module';
import { AirportTransferReviewsModule } from './airport-transfer-reviews/airport-transfer-reviews.module';
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
    BusCompaniesModule,
    BusStationsModule,
    BusSearchModule,
    BusBookingsModule,
    BusReviewsModule,
    CarRentalSearchModule,
    CarRentalBookingsModule,
    CarRentalCompaniesModule,
    CarRentalReviewsModule,
    AirportTransferSearchModule,
    AirportTransferBookingsModule,
    AirportTransferCompaniesModule,
    AirportTransferReviewsModule,
  ],
  controllers: [TestDbController],
})
export class AppModule { }

