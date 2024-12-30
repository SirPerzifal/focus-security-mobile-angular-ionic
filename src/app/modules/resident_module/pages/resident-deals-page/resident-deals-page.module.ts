import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentDealsPagePageRoutingModule } from './resident-deals-page-routing.module';

import { ResidentDealsPagePage } from './resident-deals-page.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentDealsPagePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentDealsPagePage]
})
export class ResidentDealsPagePageModule {}
