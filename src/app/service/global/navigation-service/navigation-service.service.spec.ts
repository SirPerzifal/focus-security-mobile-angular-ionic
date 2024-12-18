import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  activeButton: string = 'home'; // Default active button

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  getActiveButton() {
    return this.activeButton;
  }
}