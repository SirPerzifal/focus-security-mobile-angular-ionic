import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TermsConditionsService } from 'src/app/service/terms-conditions/terms-conditions.service';

@Component({
  selector: 'app-client-terms-conditions',
  templateUrl: './client-terms-conditions.page.html',
  styleUrls: ['./client-terms-conditions.page.scss'],
})
export class ClientTermsConditionsPage implements OnInit {

  termsHtml: SafeHtml = '';
  isLoading: boolean = false;

  constructor(
    private termsConditionsService: TermsConditionsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadTerms();
  }

  loadTerms() {
    this.isLoading = true;
    this.termsConditionsService.fetchTerms().subscribe({
      next: (terms) => {
        this.termsHtml = this.sanitizer.bypassSecurityTrustHtml(terms.html || '');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
