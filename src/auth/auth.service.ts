import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  {UserService} from "./user.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private jwt: JwtService,private readonly users: UserService, ) {}

    // Replace this with database check
    async validateUser(username: string, password: string) {
        const user = await this.users.findByUsername(username);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        return user;
    }


    async generateToken(user: any) {
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
