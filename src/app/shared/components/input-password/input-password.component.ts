import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
})
export class InputPasswordComponent  implements OnInit {

  constructor() { }

  @Input() showPassword: string = 'password'
  @Input() passwordPlaceholder: String = 'Password'
  @Output() password = new EventEmitter<string>()
  @Input() passVal: string = ''
  @Input() inputClass: string = 'border w-full rounded py-2 pl-3 pr-10 outline-[#BDBDBD] h-12 text-sm focus:outline-[var(--ion-color-primary)]'

  ngOnInit() {}

  onToggleShowPassword() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }

  onPasswordChange(event: any) {
    this.password.emit(event.target.value)
  }

  faEye = faEye
  faEyeSlash = faEyeSlash

}
