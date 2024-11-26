import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaVisitorListPageRoutingModule } from './ma-visitor-list-routing.module';

import { MaVisitorListPage } from './ma-visitor-list.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaVisitorListPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [MaVisitorListPage]
})
export class MaVisitorListPageModule {}
