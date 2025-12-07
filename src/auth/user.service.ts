import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from "../libs/common/src";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async createUser(username: string, password: string) {
        const existing = await this.userRepo.findOne({ where: { username } });

        if (existing) {
            throw new BadRequestException('Username already exists');
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({ username, password: hashed });
        return this.userRepo.save(user);
    }

    async findByUsername(username: string) {
        return this.userRepo.findOne({ where: { username } });
    }
}
