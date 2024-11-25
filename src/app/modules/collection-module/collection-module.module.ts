import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionModulePageRoutingModule } from './collection-module-routing.module';

import { CollectionModulePage } from './collection-module.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionModulePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [CollectionModulePage]
})
export class CollectionModulePageModule {}
