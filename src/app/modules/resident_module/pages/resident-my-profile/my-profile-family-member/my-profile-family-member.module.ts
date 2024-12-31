import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileFamilyMemberPageRoutingModule } from './my-profile-family-member-routing.module';

import { MyProfileFamilyMemberPage } from './my-profile-family-member.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileFamilyMemberPageRoutingModule,
    ComponentsModule, 
    SharedModule
  ],
  declarations: [MyProfileFamilyMemberPage]
})
export class MyProfileFamilyMemberPageModule {}
