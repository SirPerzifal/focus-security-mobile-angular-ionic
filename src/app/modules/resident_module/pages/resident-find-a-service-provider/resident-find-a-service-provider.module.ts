import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentFindAServiceProviderPageRoutingModule } from './resident-find-a-service-provider-routing.module';

import { ResidentFindAServiceProviderPage } from './resident-find-a-service-provider.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentFindAServiceProviderPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentFindAServiceProviderPage]
})
export class ResidentFindAServiceProviderPageModule {}
