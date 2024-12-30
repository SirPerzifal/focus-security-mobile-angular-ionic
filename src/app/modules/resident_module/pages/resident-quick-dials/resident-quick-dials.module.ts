import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentQuickDialsPageRoutingModule } from './resident-quick-dials-routing.module';

import { ResidentQuickDialsPage } from './resident-quick-dials.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentQuickDialsPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentQuickDialsPage]
})
export class ResidentQuickDialsPageModule {}
