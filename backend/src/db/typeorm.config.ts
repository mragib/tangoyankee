import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env.development') });

const configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DATABASE'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //   synchronize: configService.get('nodenv') === 'development',
  //   logging: configService.get('nodenv') === 'development',
  synchronize: false,
  logging: false,
  migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
  // migrations: [`src/db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
