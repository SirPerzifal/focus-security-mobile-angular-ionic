import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent  implements OnInit {

  @Input() text: string='';
  @Input() customClasses: {[key:string]:boolean} = {};
  @Input() icon: string = '';
  @Input() iconClass: {[key:string]:boolean} = {};;
  @Input() iconPosition: 'left' | 'middle' | 'right' = 'left'; // Added 'middle'
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';

  constructor() { }

  getFilteredClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

  ngOnInit() {}

}
