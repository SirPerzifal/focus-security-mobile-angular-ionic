import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nric-fin-selection',
  templateUrl: './nric-fin-selection.component.html',
  styleUrls: ['./nric-fin-selection.component.scss'],
})
export class NricFinSelectionComponent  implements OnInit {

  @Input() selectedIdentification!: string;
  @Input() isReadonly: boolean = false
  @Input() includePassport: boolean = false
  @Output() selectedIdentificationChange = new EventEmitter<string>();
  @Input() isMandatory: boolean = false;

  onSelectionChange(event: any) {
    this.selectedIdentificationChange.emit(event.target.value);
  }
  constructor() { }
  
  ngOnInit() {}

}
