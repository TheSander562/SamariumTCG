import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user: User | null = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as UserPayload;
    }
    return null;
  }

  login(user: UserPayload) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ access_token: string; user: UserPayload }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.login(user as UserPayload);
  }
}
