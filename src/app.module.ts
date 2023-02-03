import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configservice: ConfigService) => {
        const isDevelopment = configservice.get<string>('NODE_ENV') === 'dev';
        return {
          type: 'postgres',
          url: configservice.get<string>('POSTGRES_URL'),
          autoLoadEntities: true,
          synchronize: isDevelopment,
        };
      },
      inject: [ConfigService],
    }),
    IamModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
