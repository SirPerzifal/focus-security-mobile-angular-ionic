import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppealFormPageRoutingModule } from './appeal-form-routing.module';

import { AppealFormPage } from './appeal-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppealFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [AppealFormPage]
})
export class AppealFormPageModule {}
