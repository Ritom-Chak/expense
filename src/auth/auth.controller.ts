import {BadRequestException, Controller, Get, Post, Query, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserService} from './user.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private readonly userService: UserService) {}

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

    @Post('register')
    async register(
        @Query('username') username: string,
        @Query('password') password: string,
    ) {
        if (!username || !password) {
            throw new BadRequestException('Username & password are required');
        }

        const user = await this.userService.createUser(username, password);
        return { message: 'User created', userId: user.id };
    }

}
