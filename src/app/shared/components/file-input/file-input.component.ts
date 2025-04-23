import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() buttonText: string='';
  @Input() extraButtonClass: string='';
  @Input() customButtonStyle: string='';
  @Input() customPlaceholder: string='';
  @Input() disableUpload:boolean = false;
  @Input() labelText: string='';
  @Input() isCustomName: boolean=false
  @Input() fileName: string = ''
  @Input() fileAccept: string = ''
  @Input() labelClass: string = ''

  @Input() isCamera: boolean=false

  @Output() fileSelected = new EventEmitter<File>();
  @Output() cameraSelected = new EventEmitter<any>()
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  triggerFileInput() {
    // Programmatically click the hidden file input
    if(!this.disableUpload){
      if (!this.isCamera) {
        this.fileInput?.nativeElement.click();
      } else {
        this.takePicture()
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
      const dateStr = (() => { const n = new Date(), p = (v: any) => v.toString().padStart(2, '0'); return `${p(n.getDate())}_${p(n.getMonth()+1)}_${n.getFullYear()}_${p(n.getHours())}_${p(n.getMinutes())}_${p(n.getSeconds())}` })();
      this.selectedFileName = dateStr + '.' + image.format
      this.cameraSelected.emit({image: image.base64String, is_camera: false, name: this.selectedFileName});
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


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      this.selectedFile = file;
      this.selectedFileName = this.isCustomName ? this.fileName : file.name;
      this.fileSelected.emit(file);
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

}
