import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-my-profile',
  templateUrl: './resident-my-profile.page.html',
  styleUrls: ['./resident-my-profile.page.scss'],
})
export class ResidentMyProfilePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  toHistoryInVisitorJustBan() {
    this.router.navigate(['/history'], {
      state: {
        from: "ban",
      }
    });
  }

}
