import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
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
        return await this.userService.createUser(body.username, body.email, body.password);
    }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Post('login')
    @ApiOperation({ summary: '用户登录' })
    async login(@Body() body: { email: string; password: string }): Promise<User> {
        return await this.userService.login(body.email, body.password);
    }

    @Get('detail')
    @ApiOperation({ summary: '获取用户信息' })
    async detail(@Query() query:{
        token: string
    } ): Promise<User> {
        return await this.userService.detail(query.token);
    }
}
