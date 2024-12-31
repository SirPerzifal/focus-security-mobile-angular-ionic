import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvernightFormRarPageRoutingModule } from './overnight-form-rar-routing.module';

import { OvernightFormRarPage } from './overnight-form-rar.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OvernightFormRarPageRoutingModule,
    ComponentsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [OvernightFormRarPage]
})
export class OvernightFormRarPageModule {}
