import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientPrivacyPolicyPageRoutingModule } from './client-privacy-policy-routing.module';

import { ClientPrivacyPolicyPage } from './client-privacy-policy.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientPrivacyPolicyPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientPrivacyPolicyPage]
})
export class ClientPrivacyPolicyPageModule {}
