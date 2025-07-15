import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashCallPageRoutingModule } from './splash-call-routing.module';

import { SplashCallPage } from './splash-call.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashCallPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [SplashCallPage]
})
export class SplashCallPageModule {}
