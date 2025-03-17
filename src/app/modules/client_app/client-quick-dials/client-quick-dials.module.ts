import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientQuickDialsPageRoutingModule } from './client-quick-dials-routing.module';

import { ClientQuickDialsPage } from './client-quick-dials.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientQuickDialsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientQuickDialsPage]
})
export class ClientQuickDialsPageModule {}
