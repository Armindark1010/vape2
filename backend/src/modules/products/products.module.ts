import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';

@Module({
  controllers: [ProductsController, ProductTypesController],
  providers: [ProductsService, ProductTypesService],
  exports: [ProductsService, ProductTypesService],
})
export class ProductsModule {}
