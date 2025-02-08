import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { JWT_ACCESS_TOKEN_TTL, JWT_REFRESH_TOKEN_TTL } from '../iam.constants';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = new User();
    user.email = signUpDto.email;
    user.password = await this.hashingService.hash(signUpDto.password);

    await this.usersRepository.save(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return await this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    // all token needs user sub at least
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        } as ActiveUserData,
        JWT_ACCESS_TOKEN_TTL,
      ),
      this.signToken(
        {
          sub: user.id,
          refreshTokenId,
        } as RefreshTokenData,
        JWT_REFRESH_TOKEN_TTL,
      ),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId); // remember tiket given out
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(payload: T, expiresIn: number) {
    const token = await this.jwtService.signAsync(
      payload as ActiveUserData | RefreshTokenData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn, // access token or refresh token
      },
    );
    return token;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId }: RefreshTokenData =
        await this.jwtService.verifyAsync(
          refreshTokenDto.refreshToken,
          this.jwtConfiguration,
        );
      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      // check if user holds tiket that i just gave them
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id); // burn old tiket
      } else {
        throw new Error('Refresh token is invalid'); // ur tiket is fake
      }
      return this.generateTokens(user);
    } catch {
      // fail to read token or user don't exist in token
      throw new UnauthorizedException();
    }
  }
}
