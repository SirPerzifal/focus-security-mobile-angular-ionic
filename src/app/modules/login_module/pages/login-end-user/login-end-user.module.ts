import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginEndUserPageRoutingModule } from './login-end-user-routing.module';

import { LoginEndUserPage } from './login-end-user.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginEndUserPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [LoginEndUserPage]
})
export class LoginEndUserPageModule {}
