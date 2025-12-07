import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) {}

    // Replace this with database check
    async validateUser(username: string, password: string) {
        if (username === 'admin' && password === 'password') {
            return { id: 1, username: 'admin' };
        }
        return null;
    }

    async generateToken(user: any) {
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
