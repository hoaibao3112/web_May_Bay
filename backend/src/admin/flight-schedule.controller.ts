import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { FlightScheduleService } from './flight-schedule.service';

@Controller('admin/flights-schedule')
export class FlightScheduleController {
    constructor(private readonly flightScheduleService: FlightScheduleService) { }

    /**
     * Get all flight schedules with filters
     */
    @Get()
    getFlightSchedules(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('search') search?: string,
    ) {
        return this.flightScheduleService.getFlightSchedules({
            startDate,
            endDate,
            search,
        });
    }

    /**
     * Get all passengers for a specific flight
     */
    @Get(':id/passengers')
    getFlightPassengers(@Param('id', ParseIntPipe) changBayId: number) {
        return this.flightScheduleService.getFlightPassengers(changBayId);
    }

    /**
     * Get passenger details
     */
    @Get('passengers/:id')
    getPassengerDetails(@Param('id', ParseIntPipe) passengerId: number) {
        return this.flightScheduleService.getPassengerDetails(passengerId);
    }
}
