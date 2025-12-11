import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-terms-condition-modal',
  templateUrl: './terms-condition-modal.component.html',
  styleUrls: ['./terms-condition-modal.component.scss'],
})
export class TermsConditionModalComponent extends ApiService implements OnInit {

  termsConditionBody: string = '';
  innerHtml: string = '';

  constructor(private navParams: NavParams, http: HttpClient, private sanitizer: DomSanitizer, private functionMain: FunctionMainService, private storage: StorageService) { super(http) }

  ngOnInit() {
	console.log(this.navParams.get('terms_condition'));
	
	if (this.navParams.get('terms_condition')) {
	this.termsConditionBody = this.navParams.get('terms_condition') || '';  
	} else {
	this.loadTnc();
	}
  }

  async loadTnc() {
	try {

		await this.functionMain.vmsPreferences().then((value) => {
			if (value) {
				const headers = new HttpHeaders({
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				});
				
				this.http.post<any>(
					`${this.baseUrl}/get/tnc/text`, 
					{
					jsonrpc: '2.0',
					params: {
						project_id: value.project_id,
					}
					},
					{ headers }
				).subscribe((response: any) => {
					console.log(response);
					this.innerHtml = response.result || '';
				});
			} else {
				
			}
		})
	} catch (error) {
		console.error('Error loading T&C:', error);
		this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
			// Force check saat masuk halaman ini
			if ( value ) {
				this.storage.decodeData(value).then((value: any) => {
					if ( value ) {
						const estate = JSON.parse(value) as Estate;
						const headers = new HttpHeaders({
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						});
						
						this.http.post<any>(
							`${this.baseUrl}/get/tnc/text`, 
							{
							jsonrpc: '2.0',
							params: {
								project_id: estate.project_id,
							}
							},
							{ headers }
						).subscribe((response: any) => {
							console.log(response);
							this.innerHtml = response.result || '';
						});
					}
				})
			}
		})
	}
  }

  get sanitizedInnerHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.innerHtml);
  }
}