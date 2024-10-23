import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './user/user.model';
import { CustomConfigModule } from './config/config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CustomConfigModule, // 确保 CustomConfigModule 在 SequelizeModule 之前导入
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // 正确放置 inject
      useFactory: (configService: ConfigService) => ({
        dialect: 'sqlite',
        storage: configService.get('DB_PATH'), // SQLite 使用 storage 代替 host
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    CacheModule.register({ isGlobal: true }),
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
