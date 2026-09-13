import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-conditions-popup',
  templateUrl: './terms-conditions-popup.component.html',
  styleUrls: ['./terms-conditions-popup.component.scss'],
})
export class TermsConditionsPopupComponent {
  @Input() isOpen = false;
  @Input() title = 'Terms & Conditions of Use';
  @Input() htmlContent = '';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() accepted = new EventEmitter<void>();

  agreed = false;

  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.htmlContent || '');
  }

  onAgreedChange(checked: boolean): void {
    this.agreed = checked;
  }

  onAccept(): void {
    if (!this.agreed) {
      return;
    }

    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.accepted.emit();
    this.agreed = false;
  }
}
