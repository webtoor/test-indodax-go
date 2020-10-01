import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTransactionPageRoutingModule } from './create-transaction-routing.module';

import { CreateTransactionPage } from './create-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateTransactionPageRoutingModule
  ],
  declarations: [CreateTransactionPage]
})
export class CreateTransactionPageModule {}
