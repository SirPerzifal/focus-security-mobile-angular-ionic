import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyAddMemberPageRoutingModule } from './family-add-member-routing.module';

import { FamilyAddMemberPage } from './family-add-member.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyAddMemberPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [FamilyAddMemberPage]
})
export class FamilyAddMemberPageModule {}
