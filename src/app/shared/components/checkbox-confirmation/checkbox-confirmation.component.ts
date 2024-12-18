import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-confirmation',
  templateUrl: './checkbox-confirmation.component.html',
  styleUrls: ['./checkbox-confirmation.component.scss'],
})
export class CheckboxConfirmationComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() label: string = 'I agree to the terms above'; // Label untuk checkbox
  @Input() checked: boolean = false; // Status checkbox
  @Input() customClass: string = ''; // Kelas kustom untuk styling
  @Output() checkedChange = new EventEmitter<boolean>(); // Event untuk mengubah status

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked); // Emit event ketika checkbox berubah
  }

}
