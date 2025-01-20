import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) {}

  async downloadAndOpenFile(url: string, fileName: string) {
    try {
      // Unduh file sebagai Blob
      const response = await this.http.get(url, { responseType: 'blob' }).toPromise();
  
      if (!response) {
        throw new Error('File download failed: Response is undefined.');
      }
  
      // Konversi Blob ke Base64
      const base64Data = await this.convertBlobToBase64(response) as string;
  
      // Simpan file di direktori Documents
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents
      });
  
      console.log('File saved:', savedFile);
  
      // Buka file
      await FileOpener.open({ 
        filePath: savedFile.uri,
      });
      console.log('File opened successfully');
    } catch (error) {
      console.error('Error downloading or opening file:', error);
    }
  }
  

  private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Hapus header Base64
      };
      reader.readAsDataURL(blob);
    });
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'application/octet-stream';
    }
  }
}
