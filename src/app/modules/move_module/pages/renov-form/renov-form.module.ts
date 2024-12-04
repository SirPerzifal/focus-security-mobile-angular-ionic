import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenovFormPageRoutingModule } from './renov-form-routing.module';

import { RenovFormPage } from './renov-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    RenovFormPageRoutingModule,
    SharedModule
  ],
  declarations: [RenovFormPage]
})
export class RenovFormPageModule {}
