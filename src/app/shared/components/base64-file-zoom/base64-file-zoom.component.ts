import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-base64-file-zoom',
  templateUrl: './base64-file-zoom.component.html',
  styleUrls: ['./base64-file-zoom.component.scss'],
})
export class Base64FileZoomComponent  implements OnInit {

  constructor(public functionMain: FunctionMainService, private sanitizer: DomSanitizer) { }

  @Input() imageZoom: string = ''
  @Input() imageClass: string = 'w-12 h-12 mt-3'
  @Input() bgColor: string = 'bg-white'
  @Output() isClose = new EventEmitter<any>();
  @Input() file: any = ''

  ngOnInit() {}

  closeModal() {
    this.isOpenModal = false
    this.isClose.emit(false);
    console.log("HEY SOM HERE")
  }

  isOpenModal = false
  clickImage() {
    this.isOpenModal = true

    const closeModalOnBack = () => {
      this.closeModal()
      window.removeEventListener('popstate', closeModalOnBack);
    };
    history.pushState({ modalOpen: true }, '');
    window.addEventListener('popstate', closeModalOnBack)
  }

  getPdf(file: any) {
    console.log(file)
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${file}`);
    // return this.functionMain.convertBase64ToBlob(`data:application/pdf;base64,${file}`);
  }

}
