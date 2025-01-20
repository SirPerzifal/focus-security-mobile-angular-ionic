import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-card-application',
  templateUrl: './access-card-application.page.html',
  styleUrls: ['./access-card-application.page.scss'],
})
export class AccessCardApplicationPage implements OnInit {
  selectedOption: string = '';
  expectedCards: any = [];
  agreementChecked: boolean = false;

  constructor() { }

  ngOnInit() {
    console.log('tes');
  }

  onOptionChange(option: string) {
    this.selectedOption = option;
    if (option === 'replacement') {
      this.loadCards();
    } else if (option === 'new_application') {
      this.expectedCards = [];
      console.log("tes");
      
    }
  }

  loadCards() {
    {
      this.expectedCards = [
        { id: 1, card_number: '1234567890', assigned_resident_name: 'Beki', card_status: 'Active', },
        { id: 2, card_number: '0987654321', assigned_resident_name: 'Himmel', card_status: 'Active', },
        { id: 3, card_number: '9876543210', assigned_resident_name: 'Midoriya', card_status: 'Active', },
        { id: 4, card_number: '1234567890', assigned_resident_name: 'Anya', card_status: 'Active', },
      ];
    }
  }

  oncardSelect(card: any) {
    console.log('Selected Card:', card);
    // Perform action based on selected card
  }

  onNewCardSelect(type: any) {
    console.log('New Card Type:', type);
    // Perform action based on selected card type
  }

}
