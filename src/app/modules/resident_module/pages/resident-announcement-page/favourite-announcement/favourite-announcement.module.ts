import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavouriteAnnouncementPageRoutingModule } from './favourite-announcement-routing.module';

import { FavouriteAnnouncementPage } from './favourite-announcement.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavouriteAnnouncementPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FavouriteAnnouncementPage]
})
export class FavouriteAnnouncementPageModule {}
