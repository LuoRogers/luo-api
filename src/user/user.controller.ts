import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('用户')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    async create(@Body() body: { username: string; email: string; password: string }): Promise<User> {
        return this.userService.createUser(body.username, body.email, body.password);
    }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('login')
    @ApiOperation({ summary: '用户登录' })
    async login(@Body() body: { email: string; password: string }): Promise<User> {
        return this.userService.login(body.email, body.password);
    }
}
