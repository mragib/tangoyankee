import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeSetModule } from './attribute-set/attribute-set.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { TokenModule } from './token/token.module';
import { StorageModule } from './storage/storage.module';
import { LocatorModule } from './locator/locator.module';
import { InstanceModule } from './instance/instance.module';
import { SupplierModule } from './supplier/supplier.module';
import { PaymentsModule } from './payments/payments.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseItemsModule } from './purchase_items/purchase_items.module';
import { AccountsModule } from './accounts/accounts.module';
import { SalesModule } from './sales/sales.module';
import { SalesItemsModule } from './sales_items/sales_items.module';
import { SaleRevenueModule } from './sale_revenue/sale_revenue.module';
import { CustomerModule } from './customer/customer.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ExpenseModule } from './expense/expense.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ChartofaccountingModule } from './chartofaccounting/chartofaccounting.module';
import { JournalModule } from './journal/journal.module';
import { DailyBalanceModule } from './daily_balance/daily_balance.module';

import { CustomerPaymentPlanModule } from './customer-payment-plan/customer-payment-plan.module';
import { SupplierPaymentPlanModule } from './supplier-payment-plan/supplier-payment-plan.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppConfig, DatabaseConfig } from './config';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,

      load: [DatabaseConfig, AppConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => {
        const config = { ...configService.get('database_config') };
        return config;
      },
      inject: [ConfigService],
      // useFactory: (configService: ConfigService) => ({
      //   type: 'mysql', // or 'postgres' or any other supported DB
      //   host: configService.get<string>('DATABASE_HOST'),
      //   port: configService.get<number>('DB_PORT'),
      //   username: configService.get<string>('DATABASE_USER'),
      //   password: configService.get<string>('DB_PASSWORD'),
      //   database: configService.get<string>('DATABASE'),
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //   // synchronize: configService.get<boolean>('SYNCHRONIZE'),
      //   synchronize: false,
      //   migrationsRun: true,
      //   migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
      //   cli: {
      //     migrationsDir: 'src/db/migrations',
      //   },
      // }),
    }),
    // TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    AttributeModule,
    AttributeSetModule,
    ProductModule,
    CommonModule,
    TokenModule,
    StorageModule,
    LocatorModule,
    InstanceModule,
    SupplierModule,
    PaymentsModule,
    PurchaseModule,
    PurchaseItemsModule,
    AccountsModule,
    SalesModule,
    SalesItemsModule,
    SaleRevenueModule,
    CustomerModule,
    DeliveryModule,
    ExpenseModule,
    TransactionsModule,
    ChartofaccountingModule,
    JournalModule,
    DailyBalanceModule,
    CustomerPaymentPlanModule,
    SupplierPaymentPlanModule,
    RoleModule,
    PermissionModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from the 'uploads' folder
      serveRoot: '/uploads', // URL path
    }),
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
