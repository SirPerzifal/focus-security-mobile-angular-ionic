import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrls: ['./image-zoom.component.scss'],
})
export class ImageZoomComponent  implements OnInit {

  constructor(public functionMain: FunctionMainService) { }

  @Input() imageZoom: string = ''
  @Input() imageClass: string = 'h-32 object-contain'
  @Input() bgColor: string = 'bg-white'
  @Output() isClose = new EventEmitter<any>();
  @Input() imageArray: any = []
  
  openImage: any

  ngOnInit() {
  }

  closeModal() {
    this.isOpenModal = false
    this.isClose.emit(false);
    console.log("HEY SOM HERE")
  }

  

  isOpenModal = false
  clickImage() {
    this.isOpenModal = true
    this.openImage = this.imageZoom
  }

  layerBack() {
    const closeModalOnBack = () => {
      this.closeModal()
      window.removeEventListener('popstate', closeModalOnBack);
    };
    history.pushState({ modalOpen: true }, '');
    window.addEventListener('popstate', closeModalOnBack)
  }

  clickImageArray( image: any) {
    if (image.mimetype == 'pdf') {
      this.functionMain.downloadDocument(image.datas, image.name)
    } else { 
      this.openImage = this.functionMain.getImage(image.datas)
      this.isOpenModal = true
    }
  }
}
