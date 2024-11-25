import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyTenantExtendPageRoutingModule } from './family-tenant-extend-routing.module';

import { FamilyTenantExtendPage } from './family-tenant-extend.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyTenantExtendPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [FamilyTenantExtendPage]
})
export class FamilyTenantExtendPageModule {}
