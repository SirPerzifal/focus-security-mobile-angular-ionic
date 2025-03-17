import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientLoginPageRoutingModule } from './client-login-routing.module';

import { ClientLoginPage } from './client-login.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientLoginPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientLoginPage]
})
export class ClientLoginPageModule {}
