import { registerAs } from '@nestjs/config';

export default registerAs('database_config', () => ({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 35432,
  username: process.env.DATABASE_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: process.env.SYNCHRONIZE === 'true',
  logging: process.env.LOGGING,
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));
