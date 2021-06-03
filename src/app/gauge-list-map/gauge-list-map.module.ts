import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GaugeListMapPage } from './gauge-list-map.page';

import { NgxSpinnerModule } from "ngx-spinner";

const routes: Routes = [
  {
    path: '',
    component: GaugeListMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    NgxSpinnerModule,

    RouterModule.forChild(routes)
  ],
  declarations: [GaugeListMapPage]
})
export class GaugeListMapPageModule {}
