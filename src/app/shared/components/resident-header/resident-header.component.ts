import { Component, Input, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-resident-header',
  templateUrl: './resident-header.component.html',
  styleUrls: ['./resident-header.component.scss'],
})
export class ResidentHeaderComponent  implements OnInit {

  constructor(private apiService: ApiService) { }

  @Input() text: string=""
  @Input() text_second: string=""
  @Input() secondClass: string=""
  @Input() is_client: boolean = false
  projectId: number = 0;
  projectImageUrl: string = '';

  ngOnInit() {
    if (this.is_client) {
      this.projectImageUrl = 'assets/logoIFS.png'
    } else {
      Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
        if (value?.value) {
          const valueUseState = JSON.parse(value.value);
          this.projectId = Number(valueUseState.project_id);
          this.projectImageUrl = `${this.apiService.baseUrl}/web/image/project.project/${this.projectId}/fs_project_logo`
        }
      })
    }
  }

}
