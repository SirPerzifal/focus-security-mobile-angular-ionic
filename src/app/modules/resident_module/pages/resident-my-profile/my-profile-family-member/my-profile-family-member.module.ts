import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileFamilyMemberPageRoutingModule } from './my-profile-family-member-routing.module';

import { MyProfileFamilyMemberPage } from './my-profile-family-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileFamilyMemberPageRoutingModule
  ],
  declarations: [MyProfileFamilyMemberPage]
})
export class MyProfileFamilyMemberPageModule {}
