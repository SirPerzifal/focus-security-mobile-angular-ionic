import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachesFormPageRoutingModule } from './coaches-form-routing.module';

import { CoachesFormPage } from './coaches-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachesFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [CoachesFormPage]
})
export class CoachesFormPageModule {}
