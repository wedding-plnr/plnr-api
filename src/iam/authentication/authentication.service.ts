import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../types';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(newUser: SignUpDto) {
    const { email, password, state, username } = newUser;
    try {
      const user = new User();
      user.username = username;
      user.state = state;
      user.email = email;
      user.password = await this.hashingService.hash(password);

      await this.userRepo.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }

      throw err;
    }
  }

  async signin({ email, password }: SignInDto) {
    const user = await this.userRepo.findOneBy({ email });
    console.log('FOUND USER: ', user);

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const isValidPassword = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserData,
      {
        //audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      accessToken,
    };
  }
}
