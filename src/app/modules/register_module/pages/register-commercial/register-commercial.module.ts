import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCommercialPageRoutingModule } from './register-commercial-routing.module';

import { RegisterCommercialPage } from './register-commercial.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterCommercialPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [RegisterCommercialPage]
})
export class RegisterCommercialPageModule {}
