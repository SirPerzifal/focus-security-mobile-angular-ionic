import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TenantExtendPagePageRoutingModule } from './tenant-extend-page-routing.module';

import { TenantExtendPagePage } from './tenant-extend-page.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TenantExtendPagePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [TenantExtendPagePage]
})
export class TenantExtendPagePageModule {}
