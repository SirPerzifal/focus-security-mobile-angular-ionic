import { Component, OnInit } from '@angular/core';

interface QuickDial {
  name: string;
  number: string;
}

@Component({
  selector: 'app-resident-quick-dials',
  templateUrl: './resident-quick-dials.page.html',
  styleUrls: ['./resident-quick-dials.page.scss'],
})
export class ResidentQuickDialsPage implements OnInit {
  quickDials: QuickDial[] = [
    { name: 'Ambulance', number: '995' },
    { name: 'Police', number: '999' },
    { name: 'SCDF', number: '995' },
    { name: 'Management', number: '12345678' },
    { name: 'Security', number: '87654321' },
    { name: 'Lift', number: '12345678' },
    { name: 'AVS', number: '12345678' },
    { name: 'Acres', number: '12345678' },
    { name: 'Dengue', number: '12345678' },
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