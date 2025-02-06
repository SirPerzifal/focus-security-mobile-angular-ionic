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

  toWhere(where: string) {
    if (where === 'ban_visitor') {
      this.router.navigate(['/history'], {
        state: {
          from: "ban",
        }
      });
    } else if (where === 'family') {
      this.router.navigate(['/resident-my-family'], {
        state: {
          from: "profile",
        }
      });
    } else if (where === 'vehicle') {
      this.router.navigate(['/resident-my-vehicle'], {
        state: {
          from: "profile",
        }
      });
    }
  }

}
