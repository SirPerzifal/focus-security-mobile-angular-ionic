import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyEditMemberPageRoutingModule } from './family-edit-member-routing.module';

import { FamilyEditMemberPage } from './family-edit-member.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyEditMemberPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [FamilyEditMemberPage]
})
export class FamilyEditMemberPageModule {}
