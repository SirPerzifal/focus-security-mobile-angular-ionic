import { Component, OnInit } from '@angular/core';
import { HouseRulesService } from 'src/app/service/resident/house-rules/house-rules.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-resident-house-rules',
  templateUrl: './resident-house-rules.page.html',
  styleUrls: ['./resident-house-rules.page.scss'],
})
export class ResidentHouseRulesPage implements OnInit {
  houseRules: { title: string, base64Doc: string }[] = [];
  filteredHouseRules: { title: string, base64Doc: string }[] = [];
  searchTerm: string = '';

  constructor(private houseRulesService: HouseRulesService) { }

  ngOnInit() {
    this.loadHouseRules();
    this.filteredHouseRules = this.houseRules; // Initialize with all house rules
  }

  searchHouseRules() {
    this.filteredHouseRules = this.houseRules.filter(rule =>
      rule.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearFilter() {
    this.searchTerm = '';
    this.filteredHouseRules = this.houseRules; // Reset to all house rules
  }

  loadHouseRules() {
    this.houseRulesService.getHouseRules(1).subscribe(
      response => {
        if (response.result.response_code === 200) {
          console.log("heres the data", response);
          this.houseRules = response.result.result.map((item: any) => ({
            title: item.name,
            base64Doc: item.documents // Pastikan item.documents adalah string base64
          }));
          this.filteredHouseRules = this.houseRules;
        } else {
          console.error('Error fetching notifications:', response);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
  }

  async downloadDocument(base64Doc: string, title: string) {
    try {
      const byteCharacters = atob(base64Doc);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `${title}.pdf`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `${title}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  downloadFile(href: string, filename: string) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // Periksa apakah parentNode tidak null sebelum menghapus
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 0);
  }
}