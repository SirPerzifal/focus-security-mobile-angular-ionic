import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyFormPageRoutingModule } from './family-form-routing.module';

import { FamilyFormPage } from './family-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyFormPageRoutingModule,
    SharedModule
  ],
  declarations: [FamilyFormPage]
})
export class FamilyFormPageModule {}
