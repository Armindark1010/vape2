import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { BannersModule } from './modules/banners/banners.module';
import { ProductsModule } from './modules/products/products.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CartModule } from './modules/cart/cart.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120, // 120 requests per minute
      },
    ]),
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    BannersModule,
    ProductsModule,
    ReservationsModule,
    OrdersModule,
    PaymentsModule,
    SuppliersModule,
    SettlementsModule,
    SettingsModule,
    CartModule,
    NotificationsModule,
    AdminModule,
    StorefrontModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
