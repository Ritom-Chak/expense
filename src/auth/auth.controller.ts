import { Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('login')
    async login(
        @Query('username') username: string,
        @Query('password') password: string,
    ) {
        const user = await this.authService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.generateToken(user);
    }
}
