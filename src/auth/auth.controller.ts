import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  @IsPublic()
  postLoginEmail(@Headers('Authorization') rawToken: string) {
    // email:password -> base64
    // 풀어서 -> email:password로 만들어야함
    // 클라이언트에서 서버로 보낼 때, id,pwd 형태가 아닌,
    // 'Basic {email:password를 base64로 인코딩한 형태}'로 보냄

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  @IsPublic()
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }

  @Get('userdetail')
  // @UseGuards(AccessTokenGuard)
  async getUserDetail(@User() user: UsersModel) {
    return this.authService.getUserDetail(user.email);
  }
}
