import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPetsDetailPageRoutingModule } from './my-pets-detail-routing.module';

import { MyPetsDetailPage } from './my-pets-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPetsDetailPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [MyPetsDetailPage]
})
export class MyPetsDetailPageModule {}
