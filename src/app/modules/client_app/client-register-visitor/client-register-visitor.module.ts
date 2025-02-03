import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientRegisterVisitorPageRoutingModule } from './client-register-visitor-routing.module';

import { ClientRegisterVisitorPage } from './client-register-visitor.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientRegisterVisitorPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ClientRegisterVisitorPage]
})
export class ClientRegisterVisitorPageModule {}
