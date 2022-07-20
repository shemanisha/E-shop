import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from './components/product-search/product-search.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProductSearchComponent],
  exports: [ProductSearchComponent],
})
export class ProductsModule {}
