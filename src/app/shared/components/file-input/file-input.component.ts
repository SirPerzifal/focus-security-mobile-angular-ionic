import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';

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

  @Output() fileSelected = new EventEmitter<File>();
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  triggerFileInput() {
    // Programmatically click the hidden file input
    if(!this.disableUpload){
      this.fileInput?.nativeElement.click();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fileName'] && this.isCustomName) {
      this.selectedFileName = this.fileName;
    }
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
