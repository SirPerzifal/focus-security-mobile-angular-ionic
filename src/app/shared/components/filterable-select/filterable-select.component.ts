import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filterable-select',
  templateUrl: './filterable-select.component.html',
  styleUrls: ['./filterable-select.component.scss'],
})
export class FilterableSelectComponent  implements OnInit {

  constructor() { }

  @Input() customClasses: {[key: string]: boolean} = {};
  @Input() options: any[] = [];
  @Output() optionSelected = new EventEmitter<any>();
  filteredOptions: any[] = [];
  searchText: string = '';
  showDropdown: boolean = false;


  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges) {
    // If the 'options' input has changed, update the filtered options
    if (changes['options'] && changes['options'].currentValue) {
      this.filteredOptions = [...this.options];
    }
  }

  onInputChange() {
    this.filteredOptions = this.options.filter(option =>
      option.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.showDropdown = this.filteredOptions.length > 0;
  }

  selectOption(option: any) {
    this.searchText = option.name;
    this.showDropdown = false;
    this.optionSelected.emit(option);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  getFilteredClasses(classes: { [key: string]: boolean }) {
    return Object.keys(classes).filter(cls => classes[cls]);
  }

}
