import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashCallPageRoutingModule } from './splash-call-routing.module';

import { SplashCallPage } from './splash-call.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashCallPageRoutingModule
  ],
  declarations: [SplashCallPage]
})
export class SplashCallPageModule {}
