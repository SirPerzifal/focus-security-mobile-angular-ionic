import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAddPageRoutingModule } from './manage-add-routing.module';

import { ManageAddPage } from './manage-add.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAddPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ManageAddPage]
})
export class ManageAddPageModule {}
