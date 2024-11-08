import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginProcessPageRoutingModule } from './login-process-routing.module';

import { LoginProcessPage } from './login-process.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginProcessPageRoutingModule
  ],
  declarations: [LoginProcessPage]
})
export class LoginProcessPageModule {}
