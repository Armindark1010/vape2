import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
