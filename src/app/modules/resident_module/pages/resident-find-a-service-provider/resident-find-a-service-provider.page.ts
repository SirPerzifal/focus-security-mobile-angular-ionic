import { Component, OnInit } from '@angular/core';

interface QuickDial {
  name: string;
  number: string;
}

@Component({
  selector: 'app-resident-find-a-service-provider',
  templateUrl: './resident-find-a-service-provider.page.html',
  styleUrls: ['./resident-find-a-service-provider.page.scss'],
})
export class ResidentFindAServiceProviderPage implements OnInit {
  quickDials: QuickDial[] = [
    { name: 'Handyman', number: '995' },
    { name: 'Contractor', number: '999' },
    { name: 'Carpentary', number: '995' },
    { name: 'Curtain & Blinds', number: '12345678' },
    { name: 'Water Proofing', number: '87654321' },
    { name: 'Plumbing', number: '12345678' },
    { name: 'Locksmith', number: '12345678' },
    { name: 'Electrician', number: '12345678' },
    { name: 'Aircon Services', number: '12345678' },
  ];

  selectedQuickDial: QuickDial | null = null;
  isAnimating: boolean = false;

  constructor() { }

  ngOnInit() { }

  selectQuickDial(dial: QuickDial) {
    if (this.selectedQuickDial === dial) {
      // If the same dial is clicked, close the popup
      this.closePopup(dial.number);
    } else {
      // If a different dial is clicked, animate the popdown first
      this.isAnimating = true;
      setTimeout(() => {
        this.selectedQuickDial = dial;
        this.isAnimating = false;
      }, 300); // Match this duration with the CSS animation duration
    }
  }

  closePopup(phoneNumber?: string) {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_system');
    }
    this.isAnimating = true;
    setTimeout(() => {
      this.selectedQuickDial = null;
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
  }
}
