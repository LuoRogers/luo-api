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

  generateToken(userId: number): string {
    const token = require('crypto').randomBytes(20).toString('hex');
    console.log(token);
    this.cacheManager.set(token, userId, 300000 ); // 缓存token 1小时
    return token;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await User.findOne({ where: { email } });
    // const user = await this.userModel.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = this.generateToken(user.id); // 生成token
      return { ...user.toJSON(), token }; // 返回用户信息和token
    }
    throw new HttpException('登录失败', HttpStatus.UNAUTHORIZED);
  }

  async detail(token: string): Promise<User> {
    console.log(token);
    const userId:number = await this.cacheManager.get(token); // 从缓存中获取用户信息
    if (userId) {
      return await this.userModel.findByPk(userId);
    }
    throw new HttpException('未登录', HttpStatus.UNAUTHORIZED);
  }
  
}
