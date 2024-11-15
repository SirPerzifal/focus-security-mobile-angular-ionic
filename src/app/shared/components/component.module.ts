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

@NgModule({
  declarations: [
    ButtonComponent,
    VisitorButtonComponent,
    VisitorInputComponent,
    TextInputComponent,
    HistoryCardComponent,
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
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentsModule { }
