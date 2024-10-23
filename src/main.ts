import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
  .setTitle('User API')
  .setDescription('The user management API description')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const httpAdapter = app.getHttpAdapter()
  httpAdapter.get('/swagger', (req, res) => {
    res.set('Content-Disposition', `attachment;filename=swagger-spec.json`)
    res.send(Buffer.from(JSON.stringify(document)))
  })

  await app.listen(process.env.PORT ?? 11451);
}



bootstrap();
