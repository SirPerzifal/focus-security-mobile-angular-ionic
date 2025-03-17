import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-m2m-selection-readonly',
  templateUrl: './m2m-selection-readonly.component.html',
  styleUrls: ['./m2m-selection-readonly.component.scss'],
})
export class M2mSelectionReadonlyComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() unitNames: any = []
  @Input() isVMS: boolean = false
  @Input() labelText: string = ''
  @Input() placeholder: string = ''
  @Input() divOuterClass: string = 'min-h-14 text-base'

}
