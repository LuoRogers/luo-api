import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs'; // 修改导入
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(username: string, email: string, password: string): Promise<User> {
    // 检查是否已存在
    const user = await this.userModel.findOne({ where: { email } });
    if (user) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    const saltRounds = 10; // 盐的轮数
    const hashedPassword = await bcrypt.hash(password, saltRounds); // 加密密码

    return this.userModel.create({ username, email, password: hashedPassword });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user; // 密码匹配
    }
    throw new HttpException('登录失败', HttpStatus.UNAUTHORIZED);
    return null; // 密码不匹配
  }
}
