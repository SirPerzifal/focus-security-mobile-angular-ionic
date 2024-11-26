import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ma-visitor-list',
  templateUrl: './ma-visitor-list.page.html',
  styleUrls: ['./ma-visitor-list.page.scss'],
})
export class MaVisitorListPage implements OnInit {

  constructor(private router: Router) { }

  faUsers = faUsers

  ngOnInit() {
  }

  form() {
    this.router.navigate(['ma-visitor-form']);
  }

}
