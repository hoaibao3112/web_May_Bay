import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ValidatePromotionDto } from './dto/validate-promotion.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) { }

  // ==================== ADMIN ENDPOINTS ====================

  @Post()
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Get()
  findAll(
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (search) {
      filters.search = search;
    }
    return this.promotionsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.remove(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.getStats(id);
  }

  // ==================== CUSTOMER ENDPOINTS ====================

  @Post('validate')
  validate(@Body() dto: ValidatePromotionDto) {
    return this.promotionsService.validate(dto);
  }

  @Get('active/list')
  getActive() {
    return this.promotionsService.getActive();
  }
}
