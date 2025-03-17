import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() userName: string = 'Veeknesh';
  @Input() condoName: string = 'KingsMan Condominium';
  @Input() profileImage: string = 'https://storage.googleapis.com/a1aa/image/NWAf6fQlGwiLJkFZou5lnWGhp97H7gZehBzVmVzlOoIYO4gnA.jpg';

  constructor() { }

  ngOnInit() {}

}
