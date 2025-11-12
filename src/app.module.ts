// src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        autoIndex: process.env.NODE_ENV !== 'production',
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    UsersModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Syncing database indexes...');

      const models = this.connection.modelNames();

      for (const modelName of models) {
        try {
          const model = this.connection.model(modelName);
          await model.syncIndexes();
          console.log(`✅ Synced indexes for ${modelName}`);
        } catch (error) {
          console.error(`❌ Error syncing ${modelName}:`, error.message);
        }
      }

      console.log('✅ Database sync completed!');
    }
  }
}
