import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorInvitigFormPageRoutingModule } from './visitor-invitig-form-routing.module';

import { VisitorInvitigFormPage } from './visitor-invitig-form.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorInvitigFormPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [VisitorInvitigFormPage]
})
export class VisitorInvitigFormPageModule {}
