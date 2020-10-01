import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTransactionPage } from './create-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTransactionPageRoutingModule {}
