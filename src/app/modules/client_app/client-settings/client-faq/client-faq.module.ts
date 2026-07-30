import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFaqPageRoutingModule } from './client-faq-routing.module';
import { ClientFaqPage } from './client-faq.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientFaqPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientFaqPage]
})
export class ClientFaqPageModule {}
