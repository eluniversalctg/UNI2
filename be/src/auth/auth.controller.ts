import {
  Put,
  Post,
  Body,
  Request,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ForgotDto } from './dto/forgot.dto';
import { User } from 'src/users/entities/user.entity';
import { ResetUserDto } from 'src/auth/dto/reset-user.dto';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('forgot')
  async forgot(@Body() body: ForgotDto) {
    return this.authService.forgot(body);
  }

  @Put('reset')
  @ApiOkResponse({ type: User, isArray: false })
  @ApiNotFoundResponse({ type: undefined })
  async reset(@Body() body: ResetUserDto) {
    const user = this.authService.reset(body);

    return user;
  }
}
