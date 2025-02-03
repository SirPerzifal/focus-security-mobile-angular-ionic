import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { VisitorButtonComponent } from './visitor-button/visitor-button.component';
import { VisitorInputComponent } from './visitor-input/visitor-input.component';
import { TextInputComponent } from './text-input/text-input.component';
import { HistoryCardComponent } from './history-card/history-card.component';
import { SmallBillsCardComponent } from './small-bills-card/small-bills-card.component';
import { SmallBillsCardDetailedComponent } from './small-bills-card-detailed/small-bills-card-detailed.component';
import { ResidentHeaderComponent } from './resident-header/resident-header.component';
import { FamilyCardComponent } from './family-card/family-card.component';
import { FileInputComponent } from "./file-input/file-input.component";
import { NricFinSelectionComponent } from './nric-fin-selection/nric-fin-selection.component';
import { VmsHeaderComponent } from './vms-header/vms-header.component';
import { VmsBackgroundComponent } from './vms-background/vms-background.component';
import { VmsContactInputComponent } from './vms-contact-input/vms-contact-input/vms-contact-input.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
import SignaturePad from 'signature_pad';

@NgModule({
  declarations: [
    ButtonComponent,
    VisitorButtonComponent,
    VisitorInputComponent,
    TextInputComponent,
    HistoryCardComponent,
    SmallBillsCardComponent,
    SmallBillsCardDetailedComponent,
    ResidentHeaderComponent,
    FamilyCardComponent,
    FileInputComponent,
    NricFinSelectionComponent,
    VmsHeaderComponent,
    VmsBackgroundComponent,
    VmsContactInputComponent,
    SignaturePadComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ButtonComponent,
    VisitorButtonComponent,
    VisitorInputComponent,
    TextInputComponent,
    HistoryCardComponent,
    SmallBillsCardComponent,
    SmallBillsCardDetailedComponent,
    ResidentHeaderComponent,
    FamilyCardComponent,
    FileInputComponent,
    NricFinSelectionComponent,
    VmsHeaderComponent,
    VmsBackgroundComponent,
    VmsContactInputComponent,
    SignaturePadComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: SignaturePad,
      useValue: SignaturePad
    }
  ]
})
export class ComponentsModule { }
