import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewGaugePage } from './view-gauge.page';

import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    RouterModule.forChild([{ path: '', component: ViewGaugePage }])
  ],
  declarations: [ViewGaugePage]
})
export class ViewGaugePageModule {}
