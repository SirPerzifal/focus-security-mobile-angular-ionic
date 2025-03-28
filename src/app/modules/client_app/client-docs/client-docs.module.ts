import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDocsPageRoutingModule } from './client-docs-routing.module';

import { ClientDocsPage } from './client-docs.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDocsPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientDocsPage]
})
export class ClientDocsPageModule {}
