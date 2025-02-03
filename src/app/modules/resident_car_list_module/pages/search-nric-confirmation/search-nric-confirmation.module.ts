import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchNricConfirmationPageRoutingModule } from './search-nric-confirmation-routing.module';

import { SearchNricConfirmationPage } from './search-nric-confirmation.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchNricConfirmationPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [SearchNricConfirmationPage]
})
export class SearchNricConfirmationPageModule {}
