import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaVisitorFormPageRoutingModule } from './ma-visitor-form-routing.module';

import { MaVisitorFormPage } from './ma-visitor-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaVisitorFormPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [MaVisitorFormPage]
})
export class MaVisitorFormPageModule {}
