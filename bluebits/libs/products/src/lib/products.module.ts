import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ButtonModule } from 'primeng/button';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { UiModule } from '@bluebits/ui';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent,
  },
  { path: 'products/:productid', component: ProductDetailComponent },
  {
    path: 'category/:categoryid',
    component: ProductsListComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    RouterModule.forChild(routes),
    CheckboxModule,
    FormsModule,
    RatingModule,
    InputNumberModule,
    UiModule,
  ],
  declarations: [
    ProductSearchComponent,
    CategoriesBannerComponent,
    FeaturedProductsComponent,
    ProductItemComponent,
    ProductsListComponent,
    ProductDetailComponent,
  ],
  exports: [
    ProductSearchComponent,
    CategoriesBannerComponent,
    FeaturedProductsComponent,
    ProductItemComponent,
    ProductsListComponent,
  ],
})
export class ProductsModule {}
