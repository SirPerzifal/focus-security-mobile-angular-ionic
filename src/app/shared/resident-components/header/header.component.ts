import { Component, OnInit, Input } from '@angular/core';

import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() userName: string = 'Veeknesh';
  @Input() condoName: string = 'KingsMan Condominium';
  @Input() profileImage: string = '';
  @Input() condoImage: string = '';

  constructor(
    public functionMain: FunctionMainService
  ) { }

  ngOnInit() {}

}
