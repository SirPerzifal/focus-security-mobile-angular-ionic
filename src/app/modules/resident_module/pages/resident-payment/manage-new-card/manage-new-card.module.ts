import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageNewCardPageRoutingModule } from './manage-new-card-routing.module';

import { ManageNewCardPage } from './manage-new-card.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageNewCardPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ManageNewCardPage]
})
export class ManageNewCardPageModule {}
