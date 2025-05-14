import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent  implements OnInit {

  constructor(public functionMain: FunctionMainService) { }

  ngOnInit() {}

  @Input() buttonText: string='';
  @Input() extraButtonClass: string='h-20';
  @Input() customButtonStyle: string='';
  @Input() customPlaceholder: string='';
  @Input() showPlaceholder: boolean=false;
  @Input() disableUpload:boolean = false;
  @Input() labelText: string='';
  @Input() labelNonUnderline: string='';

  @Input() isCustomName: boolean=false
  @Input() fileName: string = ''
  @Input() fileAccept: string = ''
  @Input() labelClass: string = ''
  @Input()  outClass: string = 'min-h-20 !border'

  @Input() isCamera: boolean=false
  @Input() isMany: boolean=false

  @Output() fileSelected = new EventEmitter<File>();
  @Output() cameraSelected = new EventEmitter<any>()

  @Input() isNotVMS: boolean = false
  @Input() divOuterClass: string = 'min-h-14 text-base'
  @Input() isFileAndCamera: boolean = false
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  cameraArray: any = []
  cameraId = 0
  isModalOpen = false
  pushedModalState = false;


  triggerFileInput() {
    // Programmatically click the hidden file input
    if(!this.disableUpload){
      if (this.isFileAndCamera) {
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

      } else {
        if (!this.isCamera) {
          this.fileInput?.nativeElement.click();
        } else {
          this.takePicture()
        }
      }
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      console.log(image)
      if(!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(image.format)) {
        this.functionMain.presentToast('Only receive PNG, JPG, and JPEG files!', 'warning')
        return
      }
      const dateStr = (() => { const n = new Date(), p = (v: any) => v.toString().padStart(2, '0'); return `${p(n.getDate())}_${p(n.getMonth()+1)}_${n.getFullYear()}_${p(n.getHours())}_${p(n.getMinutes())}_${p(n.getSeconds())}` })();
      if (this.isMany) {
        this.cameraId += 1
        this.cameraArray.push({id: this.cameraId, image: image.base64String, name: 'Camera_('+ this.cameraId + ').' + image.format, type: image.format})
        this.cameraSelected.emit(this.cameraArray);
      } else {
        this.cameraArray = [{id: this.cameraId, image: image.base64String, name: dateStr + '.' + image.format}]
        this.cameraSelected.emit({image: image.base64String, name: dateStr + '.' + image.format, type: image.format})
        this.closeModal()
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fileName'] && this.isCustomName) {
      this.selectedFileName = this.fileName;
    }
  }


  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      this.selectedFile = file;
      if (this.isFileAndCamera) {
        let fileReady = await this.functionMain.convertFileToBase64(file)
        console.log(fileReady.split(',')[1])
        if (this.isMany) {
          this.cameraId += 1
          this.cameraArray.push({id: this.cameraId, image: fileReady.split(',')[1], name:file.name, type: (file.type).split('/')[1]})
          this.cameraSelected.emit(this.cameraArray);
        } else {
          this.cameraArray = [{id: this.cameraId, image: fileReady.split(',')[1], name:file.name, type: (file.type).split('/')[1]}]
          this.cameraSelected.emit({id: this.cameraId, image: fileReady.split(',')[1], name:file.name, type: (file.type).split('/')[1]})
          this.closeModal()
        }
      } else {
        this.selectedFileName = this.isCustomName ? this.fileName : file.name;
        this.fileSelected.emit(file);
      }
      // Optional: If you want to upload the file immediately
      // this.uploadFile();
    }
  }

  // Optional method for file upload
  uploadFile() {
    if (this.selectedFile) {
      // Implement your file upload logic here
      // You might use HttpClient for uploading to a server
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Example upload (you'll need to implement the actual upload service)
      // this.uploadService.upload(formData).subscribe(
      //   response => {
      //     console.log('Upload successful', response);
      //   },
      //   error => {
      //     console.error('Upload failed', error);
      //   }
      // );
    }
  }

  removeImage(i: number) {
    this.cameraArray =  this.cameraArray.filter((item: any, index: number) => index !== i)
    this.cameraSelected.emit(this.cameraArray);
  }

  closeModal() {
    this.isModalOpen = false
    if (this.pushedModalState) {
      this.pushedModalState = false;
      history.back(); // simulate the back button
    }
  
  }

  openFile() {
    this.fileInput?.nativeElement.click();
  }

}
