import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersModule } from '@bluebits/users';
import { AuthguardService } from 'libs/users/src/lib/services/authguard.service';
import { CategoriesFormComponent } from './categories/categories-form/categories-form.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { ShellComponent } from './shared/shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthguardService],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'productList', component: ProductListComponent },
      { path: 'productForm', component: ProductFormComponent },
      { path: 'productForm/:id', component: ProductFormComponent },
      { path: 'categoryList', component: CategoryListComponent },
      { path: 'categoryForm', component: CategoriesFormComponent },
      { path: 'categoryForm/:id', component: CategoriesFormComponent },
      { path: 'userList', component: UserListComponent },
      { path: 'userForm', component: UserFormComponent },
      { path: 'userForm/:id', component: UserFormComponent },
      { path: 'orderList', component: OrderListComponent },
      { path: 'orderDetails/:id', component: OrderDetailsComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes), UsersModule],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class AppRoutingModule {}
