// This script is used to run the application in an async way

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        Logger.log('Application is running');
    }
  }
bootstrap();