import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HiredCardInVisitorPageRoutingModule } from './hired-card-in-visitor-routing.module';

import { HiredCardInVisitorPage } from './hired-card-in-visitor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HiredCardInVisitorPageRoutingModule,
    SharedModule,
  ],
  declarations: [HiredCardInVisitorPage]
})
export class HiredCardInVisitorPageModule {}
