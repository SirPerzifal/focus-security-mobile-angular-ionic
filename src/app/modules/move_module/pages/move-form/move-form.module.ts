import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveFormPageRoutingModule } from './move-form-routing.module';

import { MoveFormPage } from './move-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    MoveFormPageRoutingModule
  ],
  declarations: [MoveFormPage]
})
export class MoveFormPageModule {}
