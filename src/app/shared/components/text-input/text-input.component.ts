import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent  implements OnInit {

  @Input() placeholder: string='';
  @Input() type: string='text';
  @Input() customClasses: {[key:string]:boolean} = {};
  @Input() customInputClasses: {[key:string]:boolean} = {};
  @Input() value: string = '';
  @Input() id: string = '';

  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();

  constructor() { }

  getFilteredClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

  ngOnInit() {}

  onKeyUp(event:KeyboardEvent){
    this.keyupEvent.emit(event);
  }

}
