import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-form-for-coach-registration',
  templateUrl: './form-for-coach-registration.page.html',
  styleUrls: ['./form-for-coach-registration.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class FormForCoachRegistrationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  pageName: string = 'Form New Coach';
  navButtonsSub: any[] = [
    {
      text: 'Form New Coach',
      active: true,
      action: 'click'
    },
    {
      text: 'Deactive Coach',
      active: false,
      action: 'click'
    }
  ]

  onClickNavButton(event: any) {
    this.pageName = `${event[1]}`;

    if (this.pageName === 'Deactive Coach') {
      console.log(this.pageName);
      
    }

    // Reset semua tombol menjadi tidak aktif
    this.navButtonsSub.forEach(button => {
      button.active = false;
    });

    // Aktifkan tombol yang sesuai
    const selectedButton = this.navButtonsSub.find(button => button.text === event[1]);
    if (selectedButton) {
      selectedButton.active = true;
    }
  }

}
