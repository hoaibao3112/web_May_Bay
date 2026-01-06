import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    Request,
} from '@nestjs/common';
import { BusReviewsService } from './bus-reviews.service';
import { CreateBusReviewDto } from './dto/create-bus-review.dto';

@Controller('bus-reviews')
export class BusReviewsController {
    constructor(private readonly busReviewsService: BusReviewsService) { }

    @Post()
    create(@Body() createDto: CreateBusReviewDto, @Request() req: any) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.busReviewsService.create(createDto, userId);
    }

    @Get('company/:nhaXeId')
    getCompanyReviews(
        @Param('nhaXeId', ParseIntPipe) nhaXeId: number,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return this.busReviewsService.getCompanyReviews(nhaXeId, page, limit);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.busReviewsService.remove(id, userId);
    }
}
