import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../../infrastructure/repositories/user/user.repository';
import { RegisterDto, LoginDto } from '../../dto/auth/auth.dto';
import { User, UserRole } from '../../../domain/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    // 사용자 생성
    const user = await this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      company: registerDto.company,
      role: registerDto.role || UserRole.STUDENT,
    });

    // 비밀번호 필드 제거
    const { password, ...result } = user;

    // JWT 토큰 생성
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: result as User,
      accessToken,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
    // 사용자 찾기
    const user = await this.userRepository.findOneByEmail(loginDto.email, true);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 필드 제거
    const { password, ...result } = user;

    // JWT 토큰 생성
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: result as User,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneByEmail(email, true);
    if (user && await user.comparePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserProfile(userId: string): Promise<User | null> {
    return this.userRepository.findOneById(userId);
  }
}
