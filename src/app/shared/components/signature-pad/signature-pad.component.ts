import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent  implements OnInit {

  constructor(private signaturePad: SignaturePad) { }

  ngOnInit() {}

  faPenFancy = faPenFancy
  faEraser = faEraser

  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @Output() signatureOutput = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  @Input() penColor: string= 'white';
  @Input()
  set value(val: string) {
    this.valueChange.emit(`${this.signaturePad}`.trim());
  }

  get value(): string {
    return `${this.signaturePad}`.trim()
  }

  ngAfterViewInit() {
    if (this.canvas) {
      const canvas = this.canvas.nativeElement;
      this.signaturePad = new SignaturePad(canvas);
      this.signaturePad.penColor = String(this.penColor);

      canvas.addEventListener('mouseup', this.onEnd.bind(this));
      canvas.addEventListener('touchend', this.onEnd.bind(this));
    }
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  onEnd() {
    if (this.signaturePad) {
      const signature = this.signaturePad.toDataURL();
      this.signatureOutput.emit(signature)
    }
  }


}
