import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('api/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  async getByUser(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('User ID is required');
    return this.addressService.getByUser(userId);
  }

  @Post()
  async create(
    @Body()
    body: {
      userId: string;
      label: string;
      address: string;
      latitude?: number;
      longitude?: number;
      isDefault?: boolean;
    },
  ) {
    return this.addressService.create(body.userId, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    // Note: In real app, verify userId matches
    return this.addressService.update(id, body.userId, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.addressService.delete(id);
  }
}
