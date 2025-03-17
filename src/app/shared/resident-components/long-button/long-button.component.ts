import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-long-button',
  templateUrl: './long-button.component.html',
  styleUrls: ['./long-button.component.scss'],
})
export class LongButtonComponent  implements OnInit {

  @Input() name: string = '';
  @Input() srcImage: string = '';
  @Input() routeLinkTo: string = '';

  constructor(private router: Router) { } 

  ngOnInit() {}

  routeLink() {
    this.router.navigate([this.routeLinkTo])
  }

}
