import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('search') search?: string) {
    return this.userService.getAllUsers(search);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id/points')
  async updatePoints(
    @Param('id') id: string,
    @Body() body: { delta: number; reason?: string },
  ) {
    return this.userService.updatePoints(id, body.delta, body.reason);
  }

  @Patch(':id/role')
  async setRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.userService.setRole(id, body.role);
  }
}
