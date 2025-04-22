import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceProviderMainPageRoutingModule } from './service-provider-main-routing.module';

import { ServiceProviderMainPage } from './service-provider-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceProviderMainPageRoutingModule,
    SharedModule,
  ],
  declarations: [ServiceProviderMainPage]
})
export class ServiceProviderMainPageModule {}
