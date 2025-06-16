import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-input-image-preview',
  templateUrl: './input-image-preview.component.html',
  styleUrls: ['./input-image-preview.component.scss'],
})
export class InputImagePreviewComponent implements OnInit {

  constructor(
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cameraSelected'].currentValue) {
      this.cameraSelected = changes['cameraSelected'].currentValue
    }
  }

  @Input() buttonText: string = '';
  @Input() extraButtonClass: string = 'h-20';
  @Input() customButtonStyle: string = '';
  @Input() customPlaceholder: string = '';
  @Input() showPlaceholder: boolean = false;
  @Input() disableUpload: boolean = false;
  @Input() labelText: string = '';
  @Input() labelNonUnderline: string = '';

  @Input() isCustomName: boolean = false
  @Input() fileName: string = ''
  @Input() fileAccept: string = ''
  @Input() labelClass: string = ''
  @Input() outClass: string = 'min-h-20 !border'

  @Input() cameraSelected: string = ''
  @Output() cameraSelectedChange = new EventEmitter<string>();

  @Input() isNotVMS: boolean = false
  @Input() divOuterClass: string = 'min-h-14 text-base'

  cameraArray: any = []
  cameraId = 0
  isModalOpen = false
  pushedModalState = false;
  image: any = ''

  async takePicture() {
    if (this.disableUpload) return
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(image.format)) {
        this.functionMain.presentToast('Only receive PNG, JPG, and JPEG files!', 'warning')
        return
      }
      if (image.base64String) {
        this.cameraSelected = image.base64String
        this.cameraSelectedChange.emit(this.cameraSelected)
        if (!this.isModalOpen) {
          this.openModal()
        }
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage === 'User cancelled photos app') {
          return;
        }
      }

      console.error(error)
    }

  };

  removeImage() {
    this.closeModal()
    this.cameraSelected = ''
    this.cameraSelectedChange.emit('')
  }

  openModal() {
    this.isModalOpen = true
    if (!this.pushedModalState) {
      history.pushState(null, '', location.href);
      this.pushedModalState = true;
    }

    const closeModalOnBack = () => {
      this.pushedModalState = false
      this.isModalOpen = false
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);

  }

  closeModal() {
    this.isModalOpen = false
    if (this.pushedModalState) {
      this.pushedModalState = false;
      history.back(); // simulate the back button
    }

  }

}
