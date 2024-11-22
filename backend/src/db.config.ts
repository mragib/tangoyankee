import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const configSqlLite: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db/sql.sqlite3',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
